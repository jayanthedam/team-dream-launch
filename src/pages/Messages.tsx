
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Clock } from 'lucide-react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    selectConversation,
    sendMessage,
    markAsRead,
  } = useMessaging();
  
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    const conversation = conversations.find(c => c.id === currentConversation);
    if (!conversation) return;

    await sendMessage(conversation.other_participant.id, newMessage);
    setNewMessage('');
  };

  const handleConversationSelect = async (conversationId: string) => {
    selectConversation(conversationId);
    await markAsRead(conversationId);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-lg text-slate-600 mt-2">Stay connected with the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                      currentConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleConversationSelect(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {conversation.other_participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {conversation.other_participant.name}
                          </p>
                          <div className="flex items-center text-xs text-slate-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(conversation.last_message_at)}
                          </div>
                        </div>
                      </div>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {currentConversation ? (
            <>
              <CardHeader>
                <CardTitle>
                  {conversations.find(c => c.id === currentConversation)?.other_participant.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[500px]">
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === user?.id
                                ? 'text-blue-100'
                                : 'text-slate-500'
                            }`}
                          >
                            {formatTimestamp(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[500px]">
              <div className="text-center text-slate-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
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
