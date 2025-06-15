import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageSquare, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DeleteDropdown from './DeleteDropdown';

interface Idea {
  id: string;
  title: string;
  description: string;
  full_description: string;
  project_type: string;
  status: string;
  tags: string[];
  skills_needed: string[];
  commitment: string;
  timeline: string;
  likes_count: number;
  comments_count: number;
  collaborators_count: number;
  created_at: string;
  author_id: string;
  profiles?: {
    name: string;
    email: string;
    role: string;
  };
}

interface IdeaCardProps {
  idea: Idea;
  onUpdate?: () => void;
}

const IdeaCard = ({ idea, onUpdate }: IdeaCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user || isDeleting) return;

    setIsDeleting(true);
    try {
      // Only filter by id; RLS handles ownership.
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Idea deleted successfully.",
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description:
          error?.message?.includes('violates row-level security policy')
            ? "You do not have permission to delete this idea."
            : "Failed to delete idea. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user?.id === idea.author_id;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                {idea.profiles?.name ? idea.profiles.name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{idea.profiles?.name || 'Anonymous'}</p>
              <p className="text-sm text-slate-500">{idea.profiles?.role || 'Member'}</p>
            </div>
          </div>
          <DeleteDropdown 
            onDelete={handleDelete}
            isOwner={isOwner}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={idea.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
              {idea.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {idea.project_type}
            </Badge>
          </div>
          
          <Link to={`/ideas/${idea.id}`}>
            <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
              {idea.title}
            </CardTitle>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm line-clamp-3">{idea.description}</p>

        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {idea.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{idea.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
          {idea.timeline && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{idea.timeline}</span>
            </div>
          )}
          {idea.commitment && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{idea.commitment}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-slate-600">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{idea.likes_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{idea.comments_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">{idea.collaborators_count || 0}</span>
            </div>
          </div>
          
          <Link to={`/ideas/${idea.id}`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
