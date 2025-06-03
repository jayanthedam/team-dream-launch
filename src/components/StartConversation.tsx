
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle } from 'lucide-react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface StartConversationProps {
  recipientId: string;
  recipientName: string;
  triggerText?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const StartConversation: React.FC<StartConversationProps> = ({
  recipientId,
  recipientName,
  triggerText = 'Message',
  variant = 'outline'
}) => {
  const { user } = useAuth();
  const { sendMessage } = useMessaging();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) return;

    try {
      setLoading(true);
      await sendMessage(recipientId, message);
      setMessage('');
      setIsOpen(false);
      navigate('/messages');
      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${recipientName}.`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === recipientId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send message to {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim() || loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartConversation;
