
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, MessageCircle, UserPlus, Heart, Share2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const IdeaDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Alex Chen',
      text: 'This is a fantastic idea! I have experience with React Native and would love to contribute to the mobile development.',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      user: 'Maya Patel',
      text: 'As an environmental scientist, I think this project has huge potential. Would be happy to help with the sustainability algorithms.',
      createdAt: '5 hours ago'
    }
  ]);

  // Mock idea data - in real app this would be fetched by ID
  const idea = {
    id: parseInt(id || '1'),
    title: 'EcoTrack - Sustainable Living App',
    description: 'Help users track their carbon footprint and discover eco-friendly alternatives in their daily lives',
    fullDescription: `EcoTrack is a comprehensive mobile application designed to help users monitor and reduce their environmental impact. The app will feature:

    • Carbon footprint tracking for daily activities
    • Personalized sustainability recommendations
    • Community challenges and rewards
    • Local eco-friendly business directory
    • Progress visualization and goal setting
    
    Our mission is to make sustainable living accessible and engaging for everyone. We believe that small daily choices can create significant environmental impact when multiplied across our user base.
    
    The app will use machine learning to provide increasingly accurate recommendations based on user behavior patterns and local environmental data.`,
    author: 'Sarah Johnson',
    authorRole: 'Environmental Engineer & Product Manager',
    tags: ['React Native', 'Node.js', 'Environment', 'Mobile', 'Sustainability'],
    collaborators: [
      { name: 'David Kim', role: 'Backend Developer', avatar: 'DK' },
      { name: 'Lisa Zhang', role: 'UX Designer', avatar: 'LZ' },
      { name: 'Tom Wilson', role: 'iOS Developer', avatar: 'TW' }
    ],
    status: 'Active',
    projectType: 'Mobile App',
    skillsNeeded: ['React Native Developer', 'UX Designer', 'Environmental Scientist', 'DevOps Engineer'],
    timeline: '6-8 months',
    commitment: 'Part-time (10-15 hours/week)',
    likes: 24,
    createdAt: '3 days ago'
  };

  const handleAddComment = () => {
    if (newComment.trim() && user) {
      const comment = {
        id: comments.length + 1,
        user: profile?.name || user.email || 'Anonymous',
        text: newComment,
        createdAt: 'Just now'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

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
              <Badge variant="outline">{idea.projectType}</Badge>
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
              {idea.likes + (isLiked ? 1 : 0)}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            {user && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Project
              </Button>
            )}
          </div>
        </div>

        {/* Author Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {idea.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900">{idea.author}</h3>
                <p className="text-slate-600">{idea.authorRole}</p>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {idea.createdAt}
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
                  {idea.fullDescription}
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
                {idea.tags.map((tag) => (
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
                        {comment.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{comment.user}</h4>
                        <span className="text-sm text-slate-500">{comment.createdAt}</span>
                      </div>
                      <p className="text-slate-700">{comment.text}</p>
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
                <p className="text-slate-900">{idea.timeline}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Commitment</label>
                <p className="text-slate-900">{idea.commitment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Collaborators</label>
                <p className="text-slate-900">{idea.collaborators.length} members</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Current Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {idea.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {collaborator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{collaborator.name}</p>
                      <p className="text-sm text-slate-600">{collaborator.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Needed */}
          <Card>
            <CardHeader>
              <CardTitle>Looking For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {idea.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="outline" className="block text-center py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
