
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
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const { user, profile } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedItems, setFeedItems] = useState([]);
  const [stats, setStats] = useState({
    ideas: 0,
    jobs: 0,
    members: 0
  });

  useEffect(() => {
    if (user) {
      fetchFeedData();
      fetchStats();
    }
  }, [user]);

  const fetchFeedData = async () => {
    try {
      // Fetch ideas
      const { data: ideas, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          *,
          profiles:author_id (name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ideasError) throw ideasError;

      // Fetch jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:author_id (name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (jobsError) throw jobsError;

      // Transform data to match feed format
      const transformedIdeas = ideas?.map(idea => ({
        id: idea.id,
        type: 'idea' as const,
        author: idea.profiles?.name || 'Unknown',
        authorRole: idea.profiles?.role || 'Member',
        title: idea.title,
        description: idea.description,
        tags: idea.tags || [],
        likes: idea.likes_count || 0,
        comments: idea.comments_count || 0,
        shares: 0,
        timestamp: formatTimestamp(idea.created_at)
      })) || [];

      const transformedJobs = jobs?.map(job => ({
        id: job.id,
        type: 'job' as const,
        author: job.profiles?.name || 'Unknown',
        authorRole: job.profiles?.role || 'Member',
        title: job.title,
        description: job.description,
        location: job.location,
        compensation: job.compensation,
        tags: job.skills || [],
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: formatTimestamp(job.created_at)
      })) || [];

      // Combine and sort by timestamp
      const combinedFeed = [...transformedIdeas, ...transformedJobs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setFeedItems(combinedFeed);
    } catch (error) {
      console.error('Error fetching feed data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [ideasCount, jobsCount, membersCount] = await Promise.all([
        supabase.from('ideas').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        ideas: ideasCount.count || 0,
        jobs: jobsCount.count || 0,
        members: membersCount.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleCreatePost = (data: any) => {
    const newItem = {
      id: Date.now(), // Temporary ID
      type: data.type,
      author: profile?.name || user?.email || 'Anonymous',
      authorRole: profile?.role || 'Member',
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                Where{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Innovation
                </span>{' '}
                Meets{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Collaboration
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join thousands of innovators, developers, and creators building the future together. 
                Share your ideas, find collaborators, and turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Started
                  </Button>
                </Link>
                <Link to="/ideas">
                  <Button size="lg" variant="outline">
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
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U'}
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
              className="flex-1 text-slate-600 hover:text-purple-600"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Idea
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-slate-600 hover:text-green-600"
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
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-lg font-semibold">{stats.ideas}</div>
            <div className="text-sm text-slate-600">Active Ideas</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-lg font-semibold">{stats.jobs}</div>
            <div className="text-sm text-slate-600">Open Jobs</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-lg font-semibold">{stats.members}</div>
            <div className="text-sm text-slate-600">Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {feedItems.map((item) => (
          <FeedItem key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline">
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
