
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  other_participant?: {
    name: string;
  };
  unread_count?: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user?.id},participant_2_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Fetch other participant details for each conversation
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          const otherParticipantId = conv.participant_1_id === user?.id 
            ? conv.participant_2_id 
            : conv.participant_1_id;

          const { data: profileData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', otherParticipantId)
            .single();

          return {
            ...conv,
            other_participant: {
              name: profileData?.name || 'Unknown User'
            }
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${conversation.participant_1_id},receiver_id.eq.${conversation.participant_2_id}),and(sender_id.eq.${conversation.participant_2_id},receiver_id.eq.${conversation.participant_1_id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles for messages
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

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const receiverId = conversation.participant_1_id === user.id 
      ? conversation.participant_2_id 
      : conversation.participant_1_id;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: receiverId
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {conversation.other_participant?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {conversation.other_participant?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {conversation.last_message_at ? 
                          new Date(conversation.last_message_at).toLocaleDateString() : 
                          'No messages'
                        }
                      </p>
                    </div>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <CardTitle>
                  {conversations.find(c => c.id === selectedConversation)?.other_participant?.name || 'Chat'}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
