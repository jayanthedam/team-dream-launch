
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Users, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from '@/components/ChatWindow';

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      participant: 'Sarah Johnson',
      role: 'Environmental Engineer',
      lastMessage: 'Thanks for your interest in the EcoTrack project! When would be a good time to discuss?',
      timestamp: '2 hours ago',
      unread: 2,
      avatar: 'SJ',
      online: true
    },
    {
      id: 2,
      participant: 'Alex Chen',
      role: 'CTO at TechCorp',
      lastMessage: 'Great! Let me know if you have any questions about the React position.',
      timestamp: '1 day ago',
      unread: 0,
      avatar: 'AC',
      online: false
    },
    {
      id: 3,
      participant: 'Maria Rodriguez',
      role: 'Product Designer',
      lastMessage: 'I love your design system approach! Would you be interested in collaborating?',
      timestamp: '3 days ago',
      unread: 1,
      avatar: 'MR',
      online: true
    },
    {
      id: 4,
      participant: 'David Kim',
      role: 'AI Researcher',
      lastMessage: 'The learning assistant idea is fascinating. Let\'s discuss the technical implementation.',
      timestamp: '1 week ago',
      unread: 0,
      avatar: 'DK',
      online: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                    selectedChat === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {conversation.participant}
                        </h3>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-600 text-white ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{conversation.role}</p>
                      <p className="text-sm text-slate-600 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-slate-400">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <ChatWindow 
              conversation={conversations.find(c => c.id === selectedChat)!}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a conversation</h3>
                <p className="text-slate-500">Choose a conversation from the list to start messaging</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
