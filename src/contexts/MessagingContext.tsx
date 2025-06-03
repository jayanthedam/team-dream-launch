
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender_profile?: {
    name: string;
  };
}

interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  other_participant: {
    id: string;
    name: string;
  };
  unread_count: number;
}

interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1_id,
          participant_2_id,
          last_message_at,
          participant_1:participant_1_id(id, name),
          participant_2:participant_2_id(id, name)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const conversationsWithDetails = await Promise.all((data || []).map(async (conv) => {
        const otherParticipant = conv.participant_1_id === user.id ? conv.participant_2 : conv.participant_1;
        
        // Get unread count for this conversation
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false)
          .or(`sender_id.eq.${conv.participant_1_id},sender_id.eq.${conv.participant_2_id}`)
          .neq('sender_id', user.id);

        return {
          id: conv.id,
          participant_1_id: conv.participant_1_id,
          participant_2_id: conv.participant_2_id,
          last_message_at: conv.last_message_at,
          other_participant: {
            id: otherParticipant.id,
            name: otherParticipant.name,
          },
          unread_count: count || 0,
        };
      }));

      setConversations(conversationsWithDetails);
      
      // Calculate total unread count
      const totalUnread = conversationsWithDetails.reduce((sum, conv) => sum + conv.unread_count, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversationId: string) => {
    setCurrentConversation(conversationId);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:sender_id(name)
        `)
        .or(`sender_id.in.(${conversations.find(c => c.id === conversationId)?.participant_1_id},${conversations.find(c => c.id === conversationId)?.participant_2_id}),receiver_id.in.(${conversations.find(c => c.id === conversationId)?.participant_1_id},${conversations.find(c => c.id === conversationId)?.participant_2_id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;

    try {
      // First, get or create conversation
      const { data: conversationId, error: convError } = await supabase
        .rpc('get_or_create_conversation', {
          user1_id: user.id,
          user2_id: receiverId
        });

      if (convError) throw convError;

      // Send the message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content
        })
        .select(`
          *,
          sender_profile:sender_id(name)
        `)
        .single();

      if (error) throw error;

      // Update local state if this is the current conversation
      if (currentConversation) {
        setMessages(prev => [...prev, data]);
      }

      // Refresh conversations to update timestamp and counts
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('read', false)
        .or(`sender_id.eq.${conversation.participant_1_id},sender_id.eq.${conversation.participant_2_id}`)
        .neq('sender_id', user.id);

      // Refresh conversations to update unread counts
      await fetchConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          // Refresh conversations when receiving a new message
          fetchConversations();
          
          // If the message is for the current conversation, add it to messages
          if (currentConversation) {
            const conversation = conversations.find(c => c.id === currentConversation);
            if (conversation && (payload.new.sender_id === conversation.participant_1_id || payload.new.sender_id === conversation.participant_2_id)) {
              setMessages(prev => [...prev, payload.new as Message]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentConversation, conversations]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        unreadCount,
        loading,
        fetchConversations,
        selectConversation,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
