import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PenSquare, Plus, TrendingUp, Users, Lightbulb, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostModal from '@/components/CreatePostModal';
import FeedItem from '@/components/FeedItem';

const Home = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedItems, setFeedItems] = useState([
    {
      id: 1,
      type: 'idea' as const,
      author: 'Sarah Johnson',
      authorRole: 'Environmental Engineer',
      title: 'EcoTrack - Sustainable Living App',
      description: 'Help users track their carbon footprint and discover eco-friendly alternatives in their daily lives',
      tags: ['React Native', 'Sustainability', 'Mobile'],
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: '3 hours ago'
    },
    {
      id: 2,
      type: 'job' as const,
      author: 'Alex Chen',
      authorRole: 'CTO at TechCorp',
      title: 'Senior React Developer',
      description: 'Join our team to build the next generation of web applications',
      location: 'Remote',
      compensation: '$80k-120k',
      tags: ['React', 'TypeScript', 'Node.js'],
      likes: 15,
      comments: 12,
      shares: 5,
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'post' as const,
      author: 'Maria Rodriguez',
      authorRole: 'Product Designer',
      content: 'Just launched our new design system! Excited to see how it improves our development workflow. The key was focusing on consistency and developer experience. #designsystem #ux #productivity',
      likes: 42,
      comments: 16,
      shares: 8,
      timestamp: '1 day ago'
    },
    {
      id: 4,
      type: 'idea' as const,
      author: 'David Kim',
      authorRole: 'AI Researcher',
      title: 'AI-Powered Learning Assistant',
      description: 'Personalized education platform using machine learning to adapt to each student\'s learning style',
      tags: ['AI', 'Education', 'Python'],
      likes: 67,
      comments: 23,
      shares: 12,
      timestamp: '2 days ago'
    },
    {
      id: 5,
      type: 'job' as const,
      author: 'Lisa Zhang',
      authorRole: 'Startup Founder',
      title: 'UX/UI Designer',
      description: 'Looking for a creative designer to help shape the future of fintech',
      location: 'San Francisco, CA',
      compensation: 'Equity + $70k',
      tags: ['Figma', 'Fintech', 'Design'],
      likes: 28,
      comments: 9,
      shares: 4,
      timestamp: '3 days ago'
    }
  ]);

  const handleCreatePost = (data: any) => {
    const newItem = {
      id: feedItems.length + 1,
      type: data.type,
      author: user?.name || 'Anonymous',
      authorRole: user?.role || 'Member',
      content: data.content,
      title: data.title,
      description: data.description,
      location: data.location,
      compensation: data.compensation,
      tags: data.tags,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now'
    };
    setFeedItems([newItem, ...feedItems]);
  };

  if (!user) {
    // Show original hero page for non-logged in users
    return (
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(48, 55, 68, 0.1), rgba(180, 197, 228, 0.1))' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                Where{' '}
                <span style={{ background: 'linear-gradient(to right, #303744, #B4C5E4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                  Innovation
                </span>{' '}
                Meets{' '}
                <span style={{ background: 'linear-gradient(to right, #B4C5E4, #303744)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                  Collaboration
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join thousands of innovators, developers, and creators building the future together. 
                Share your ideas, find collaborators, and turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="text-white" style={{ background: 'linear-gradient(to right, #303744, #B4C5E4)' }}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/ideas">
                  <Button size="lg" variant="outline" style={{ borderColor: '#B4C5E4', color: '#303744' }}>
                    Browse Ideas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Create Post Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback style={{ background: 'linear-gradient(to right, #303744, #B4C5E4)' }} className="text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Share an update, idea, or opportunity..."
                className="cursor-pointer"
                onClick={() => setIsCreateModalOpen(true)}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              className="flex-1 text-slate-600 hover:text-blue-600"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Post
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-slate-600 hover:text-indigo-600"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Idea
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-slate-600 hover:text-slate-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#B4C5E4' }}>
                <Lightbulb className="w-4 h-4" style={{ color: '#303744' }} />
              </div>
            </div>
            <div className="text-lg font-semibold">127</div>
            <div className="text-sm text-slate-600">Active Ideas</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#303744' }}>
                <Briefcase className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-lg font-semibold">89</div>
            <div className="text-sm text-slate-600">Open Jobs</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to right, #303744, #B4C5E4)' }}>
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-lg font-semibold">1.2k</div>
            <div className="text-sm text-slate-600">Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {feedItems.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" style={{ borderColor: '#B4C5E4', color: '#303744' }}>
          Load More Posts
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default Home;
