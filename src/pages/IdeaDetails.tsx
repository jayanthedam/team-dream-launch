
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, MessageCircle, UserPlus, Heart, Share2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StartConversation from '@/components/StartConversation';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

interface Idea {
  id: string;
  title: string;
  description: string;
  full_description: string;
  author_id: string;
  project_type: string;
  status: string;
  tags: string[];
  skills_needed: string[];
  timeline: string;
  commitment: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    name: string;
    role: string;
  };
}

const IdeaDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dummy data as fallback
  const dummyIdea: Idea = {
    id: id || '1',
    title: 'EcoTrack - Sustainable Living App',
    description: 'Help users track their carbon footprint and discover eco-friendly alternatives in their daily lives',
    full_description: `EcoTrack is a comprehensive mobile application designed to help users monitor and reduce their environmental impact. The app will feature:

    • Carbon footprint tracking for daily activities
    • Personalized sustainability recommendations
    • Community challenges and rewards
    • Local eco-friendly business directory
    • Progress visualization and goal setting
    
    Our mission is to make sustainable living accessible and engaging for everyone. We believe that small daily choices can create significant environmental impact when multiplied across our user base.
    
    The app will use machine learning to provide increasingly accurate recommendations based on user behavior patterns and local environmental data.`,
    author_id: 'dummy-author-id',
    project_type: 'Mobile App',
    status: 'Active',
    tags: ['React Native', 'Node.js', 'Environment', 'Mobile', 'Sustainability'],
    skills_needed: ['React Native Developer', 'UX Designer', 'Environmental Scientist', 'DevOps Engineer'],
    timeline: '6-8 months',
    commitment: 'Part-time (10-15 hours/week)',
    likes_count: 24,
    comments_count: 2,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Sarah Johnson',
      role: 'Environmental Engineer & Product Manager'
    }
  };

  useEffect(() => {
    fetchIdea();
    fetchComments();
  }, [id]);

  const fetchIdea = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          profiles:author_id (name, role)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching idea:', error);
        // Use dummy data if idea not found
        setIdea(dummyIdea);
      } else {
        setIdea(data);
      }
    } catch (error) {
      console.error('Error fetching idea:', error);
      setIdea(dummyIdea);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles:author_id (name)
        `)
        .eq('idea_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Set dummy comments if real ones can't be fetched
      setComments([
        {
          id: '1',
          content: 'This is a fantastic idea! I have experience with React Native and would love to contribute to the mobile development.',
          author_id: 'dummy-user-1',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          profiles: { name: 'Alex Chen' }
        },
        {
          id: '2',
          content: 'As an environmental scientist, I think this project has huge potential. Would be happy to help with the sustainability algorithms.',
          author_id: 'dummy-user-2',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          profiles: { name: 'Maya Patel' }
        }
      ]);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !idea) return;

    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .insert([
          {
            idea_id: idea.id,
            author_id: user.id,
            content: newComment
          }
        ])
        .select(`
          *,
          profiles:author_id (name)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      // Add comment locally as fallback
      const comment = {
        id: Date.now().toString(),
        content: newComment,
        author_id: user.id,
        created_at: new Date().toISOString(),
        profiles: { name: profile?.name || user.email || 'Anonymous' }
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading idea...</div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Idea not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/ideas">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={idea.status === 'Active' ? 'default' : 'secondary'}>
                {idea.status}
              </Badge>
              <Badge variant="outline">{idea.project_type}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{idea.title}</h1>
            <p className="text-lg text-slate-600">{idea.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? 'text-red-600 border-red-600' : ''}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {idea.likes_count + (isLiked ? 1 : 0)}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            {user && user.id !== idea.author_id && (
              <>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Project
                </Button>
                <StartConversation 
                  recipientId={idea.author_id}
                  recipientName={idea.profiles.name}
                />
              </>
            )}
          </div>
        </div>

        {/* Author Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {idea.profiles.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900">{idea.profiles.name}</h3>
                <p className="text-slate-600">{idea.profiles.role}</p>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {formatTimestamp(idea.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Full Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {idea.full_description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies & Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {idea.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discussion ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Comment */}
              {user ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts or ask questions..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    Post Comment
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 mb-3">Join the discussion</p>
                  <Link to="/login">
                    <Button>Sign in to comment</Button>
                  </Link>
                </div>
              )}

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {comment.profiles.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{comment.profiles.name}</h4>
                        <span className="text-sm text-slate-500">{formatTimestamp(comment.created_at)}</span>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Timeline</label>
                <p className="text-slate-900">{idea.timeline || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Commitment</label>
                <p className="text-slate-900">{idea.commitment || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Comments</label>
                <p className="text-slate-900">{comments.length} comments</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Needed */}
          {idea.skills_needed && idea.skills_needed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {idea.skills_needed.map((skill, index) => (
                    <Badge key={index} variant="outline" className="block text-center py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
