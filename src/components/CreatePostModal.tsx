
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit }: CreatePostModalProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: content.trim(),
          image_url: imageUrl || null
        });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Your post has been published.",
      });

      setContent('');
      setImageUrl('');
      onClose();
      onSubmit();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setImageUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span>Create a post</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-0 p-0 text-lg placeholder:text-slate-400 focus-visible:ring-0"
            autoFocus
          />

          <div className="space-y-4">
            <ImageUpload
              onImageSelect={setImageUrl}
              currentImage={imageUrl}
              onRemoveImage={() => setImageUrl('')}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-slate-500">
              {content.length}/280 characters
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting || content.length > 280}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
