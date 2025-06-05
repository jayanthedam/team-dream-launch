
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PenSquare, Plus, TrendingUp, Users, Lightbulb, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
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
    // Enhanced hero page for non-logged in users
    return (
      <div className="space-y-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Where innovation begins</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                  Where{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Innovation
                  </span>{' '}
                  <br />
                  Meets{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Collaboration
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of innovators, developers, and creators building the future together. 
                  Share your ideas, find collaborators, and turn your vision into reality.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/ideas">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-2 hover:bg-slate-50">
                    Browse Ideas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to innovate</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Powerful tools and community features to help you bring your ideas to life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Share Ideas</h3>
                <p className="text-slate-600 leading-relaxed">
                  Present your innovative concepts and get feedback from a community of makers and creators.
                </p>
              </Card>
              
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Find Collaborators</h3>
                <p className="text-slate-600 leading-relaxed">
                  Connect with talented individuals who share your vision and complement your skills.
                </p>
              </Card>
              
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Discover Opportunities</h3>
                <p className="text-slate-600 leading-relaxed">
                  Explore exciting job opportunities and freelance projects in the innovation space.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.name?.split(' ')[0] || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-lg text-slate-600">What would you like to create today?</p>
        </div>

        {/* Create Post Section */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                  {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="Share an update, idea, or opportunity..."
                  className="cursor-pointer h-12 text-base border-slate-200 focus:border-blue-300"
                  onClick={() => setIsCreateModalOpen(true)}
                  readOnly
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="ghost"
                className="flex flex-col items-center p-4 h-auto text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PenSquare className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Post Update</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center p-4 h-auto text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Lightbulb className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Share Idea</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center p-4 h-auto text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Briefcase className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Post Job</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.ideas}</div>
              <div className="text-sm text-slate-600">Active Ideas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.jobs}</div>
              <div className="text-sm text-slate-600">Open Jobs</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.members}</div>
              <div className="text-sm text-slate-600">Members</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {feedItems.length > 0 ? (
            feedItems.map((item) => (
              <FeedItem key={`${item.type}-${item.id}`} item={item} />
            ))
          ) : (
            <Card className="text-center py-12 border-0 shadow-md">
              <CardContent>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No activity yet</h3>
                <p className="text-slate-600 mb-4">Be the first to share something with the community!</p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        {feedItems.length > 0 && (
          <div className="text-center py-6">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </div>
  );
};

export default Home;
