
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    name: string;
    email: string;
  };
  user_has_liked: boolean;
}

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

const PostCard = ({ post, onUpdate }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d ago';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      if (post.user_has_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });

        if (error) throw error;
      }

      onUpdate();
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                {post.author.name.split(' ').map(n => n[0]).join('') || post.author.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-slate-900">{post.author.name}</p>
              <p className="text-sm text-slate-500">{formatTimestamp(post.created_at)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-900 leading-relaxed">{post.content}</p>
        
        {post.image_url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 transition-colors ${
                post.user_has_liked ? 'text-red-600' : 'text-slate-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-slate-600 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
