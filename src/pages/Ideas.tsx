
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users, ArrowRight, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Ideas = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const ideas = [
    {
      id: 1,
      title: 'EcoTrack - Sustainable Living App',
      description: 'Help users track their carbon footprint and discover eco-friendly alternatives in their daily lives',
      fullDescription: 'A comprehensive mobile application that helps users monitor their environmental impact...',
      author: 'Sarah Johnson',
      tags: ['React Native', 'Node.js', 'Environment', 'Mobile'],
      collaborators: 3,
      status: 'Active',
      projectType: 'Mobile App',
      skillsNeeded: ['React Native Developer', 'UX Designer', 'Environmental Scientist'],
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'AI-Powered Learning Platform',
      description: 'Personalized education platform using machine learning algorithms to adapt to each student',
      fullDescription: 'An innovative educational platform that uses AI to create personalized learning paths...',
      author: 'Alex Chen',
      tags: ['Python', 'Machine Learning', 'Education', 'AI'],
      collaborators: 5,
      status: 'Active',
      projectType: 'Web Platform',
      skillsNeeded: ['ML Engineer', 'Frontend Developer', 'Education Specialist'],
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Local Business Network',
      description: 'Connect local businesses with customers and service providers in their community',
      fullDescription: 'A platform designed to strengthen local economies by connecting businesses...',
      author: 'Maria Rodriguez',
      tags: ['React', 'GraphQL', 'Business', 'Community'],
      collaborators: 2,
      status: 'Planning',
      projectType: 'Web Platform',
      skillsNeeded: ['Full-stack Developer', 'Business Analyst', 'Marketing Specialist'],
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Smart Home IoT Dashboard',
      description: 'Unified dashboard for managing all IoT devices in a smart home setup',
      fullDescription: 'Create a comprehensive dashboard that brings together all smart home devices...',
      author: 'David Kim',
      tags: ['IoT', 'React', 'Python', 'Hardware'],
      collaborators: 1,
      status: 'Active',
      projectType: 'IoT Solution',
      skillsNeeded: ['IoT Developer', 'Frontend Developer', 'Hardware Engineer'],
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Mental Health Support Network',
      description: 'Anonymous peer support platform for mental health awareness and assistance',
      fullDescription: 'A safe space where people can share experiences and support each other...',
      author: 'Emily Watson',
      tags: ['React', 'Node.js', 'Healthcare', 'Social'],
      collaborators: 4,
      status: 'Development',
      projectType: 'Web Platform',
      skillsNeeded: ['Psychologist', 'Security Expert', 'Community Manager'],
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Blockchain Voting System',
      description: 'Secure and transparent voting system using blockchain technology',
      fullDescription: 'A revolutionary voting platform that ensures transparency and security...',
      author: 'Robert Taylor',
      tags: ['Blockchain', 'Solidity', 'Security', 'Government'],
      collaborators: 3,
      status: 'Planning',
      projectType: 'Blockchain',
      skillsNeeded: ['Blockchain Developer', 'Security Auditor', 'Legal Advisor'],
      image: '/placeholder.svg'
    }
  ];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || idea.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || idea.projectType.toLowerCase().replace(' ', '-') === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ideas Marketplace</h1>
          <p className="text-slate-600">Discover innovative projects and find your next collaboration</p>
        </div>
        {user && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Submit Idea
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search ideas, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="web-platform">Web Platform</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="iot-solution">IoT Solution</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredIdeas.length} of {ideas.length} ideas
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Ideas Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={
                  idea.status === 'Active' ? 'default' : 
                  idea.status === 'Development' ? 'secondary' : 
                  'outline'
                }>
                  {idea.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.projectType}
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {idea.title}
              </CardTitle>
              <CardDescription className="text-slate-600 line-clamp-2">
                {idea.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {idea.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {idea.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Skills Needed Preview */}
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Looking for:</span> {idea.skillsNeeded[0]}
                  {idea.skillsNeeded.length > 1 && ` +${idea.skillsNeeded.length - 1} more`}
                </div>

                {/* Author and Collaborators */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">by {idea.author}</span>
                  <div className="flex items-center text-slate-600">
                    <Users className="w-4 h-4 mr-1" />
                    {idea.collaborators} collaborators
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/ideas/${idea.id}`}>
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all" variant="outline">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No ideas found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ideas;
