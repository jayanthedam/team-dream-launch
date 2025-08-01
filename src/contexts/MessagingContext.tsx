
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender_profile: {
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
  last_message?: {
    content: string;
    sender_id: string;
  };
  unread_count: number;
}

interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  selectConversation: (conversationId: string | null) => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      
      // Get conversations where user is a participant
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1_id,
          participant_2_id,
          last_message_at
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // For each conversation, get the other user's profile and last message
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const otherUserId = conv.participant_1_id === user.id 
            ? conv.participant_2_id 
            : conv.participant_1_id;

          // Get other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('id', otherUserId)
            .single();

          // Get last message
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, sender_id')
            .or(`and(sender_id.eq.${conv.participant_1_id},receiver_id.eq.${conv.participant_2_id}),and(sender_id.eq.${conv.participant_2_id},receiver_id.eq.${conv.participant_1_id})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Count unread messages for this conversation
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('sender_id', otherUserId)
            .eq('read', false);

          return {
            ...conv,
            other_participant: {
              id: otherUserId,
              name: profileData?.name || 'Unknown User'
            },
            last_message: lastMessageData || undefined,
            unread_count: unreadCount || 0
          };
        })
      );

      setConversations(conversationsWithDetails);
      
      // Count total unread messages
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          read
        `)
        .or(`and(sender_id.eq.${conversation.participant_1_id},receiver_id.eq.${conversation.participant_2_id}),and(sender_id.eq.${conversation.participant_2_id},receiver_id.eq.${conversation.participant_1_id})`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get sender profiles for all messages
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: {
              name: senderProfile?.name || 'Unknown User'
            }
          };
        })
      );

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;

    try {
      // Get or create conversation
      const { data: conversationData, error: conversationError } = await supabase
        .rpc('get_or_create_conversation', {
          user1_id: user.id,
          user2_id: receiverId
        });

      if (conversationError) throw conversationError;

      // Send message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: receiverId,
            content: content
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      // Get sender profile
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      // Add message to current messages if viewing this conversation
      if (currentConversation) {
        setMessages(prev => [{
          ...messageData,
          sender_profile: {
            name: senderProfile?.name || 'Unknown User'
          }
        }, ...prev]);
      }

      // Refresh conversations to update last message
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      // Mark all messages from the other participant as read
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', conversation.other_participant.id)
        .eq('read', false);

      if (error) throw error;

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.sender_id === conversation.other_participant.id && msg.receiver_id === user.id
            ? { ...msg, read: true } 
            : msg
        )
      );

      // Refresh conversations to update unread counts
      await fetchConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const selectConversation = (conversationId: string | null) => {
    setCurrentConversation(conversationId);
    if (conversationId) {
      fetchMessages(conversationId);
    }
  };

  const refreshConversations = async () => {
    await fetchConversations();
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const value: MessagingContextType = {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    selectConversation,
    sendMessage,
    fetchMessages,
    markAsRead,
    refreshConversations
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
