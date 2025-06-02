
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Users, Search, Filter, Plus, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Idea {
  id: string;
  title: string;
  description: string;
  full_description: string;
  project_type: string;
  status: string;
  timeline: string;
  commitment: string;
  tags: string[];
  skills_needed: string[];
  likes_count: number;
  comments_count: number;
  collaborators_count: number;
  created_at: string;
  profiles: {
    name: string;
    role: string;
  };
}

const Ideas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          profiles:author_id (name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || idea.project_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Ideas</h1>
          <p className="text-lg text-slate-600">Discover innovative projects and find collaborators</p>
        </div>
        <Link to="/submit-idea">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Submit Idea
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search ideas, technologies, or keywords..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Web Platform">Web Platform</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="IoT Solution">IoT Solution</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{idea.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {idea.profiles?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{idea.profiles?.name || 'Anonymous'}</span>
                    </div>
                    <span>•</span>
                    <span>{formatTimestamp(idea.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline">{idea.status}</Badge>
                  <Badge variant="secondary">{idea.project_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                {idea.timeline && (
                  <div>
                    <span className="font-medium">Timeline:</span> {idea.timeline}
                  </div>
                )}
                {idea.commitment && (
                  <div>
                    <span className="font-medium">Commitment:</span> {idea.commitment}
                  </div>
                )}
              </div>

              {idea.tags && idea.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Technologies:</div>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.slice(0, 5).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{idea.tags.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {idea.skills_needed && idea.skills_needed.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Looking for:</div>
                  <div className="flex flex-wrap gap-2">
                    {idea.skills_needed.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {idea.skills_needed.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{idea.skills_needed.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-slate-600">
                    <Heart className="w-4 h-4 mr-1" />
                    {idea.likes_count}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {idea.comments_count}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Users className="w-4 h-4 mr-1" />
                    {idea.collaborators_count} collaborators
                  </div>
                </div>
                <Link to={`/ideas/${idea.id}`}>
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No ideas found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Ideas;
