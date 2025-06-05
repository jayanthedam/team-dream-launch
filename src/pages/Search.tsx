
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search as SearchIcon, Filter, Lightbulb, Briefcase, User, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface SearchFilters {
  type: 'all' | 'ideas' | 'jobs' | 'users';
  skills: string;
  location: string;
  status: string;
}

interface SearchResult {
  type: 'idea' | 'job' | 'user';
  id: string;
  title: string;
  description: string;
  tags?: string[];
  skills?: string[];
  name?: string;
  role?: string;
  location?: string;
  status?: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    skills: '',
    location: '',
    status: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2 || filters.skills || filters.location || filters.status) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchQuery = searchTerm.toLowerCase();
      let searchResults: SearchResult[] = [];

      // Search ideas
      if (filters.type === 'all' || filters.type === 'ideas') {
        let ideasQuery = supabase
          .from('ideas')
          .select('id, title, description, tags, skills_needed, status');

        if (searchQuery) {
          ideasQuery = ideasQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        if (filters.status) {
          ideasQuery = ideasQuery.eq('status', filters.status);
        }

        const { data: ideas } = await ideasQuery.limit(20);

        const ideaResults = (ideas || [])
          .filter(idea => {
            if (filters.skills) {
              const hasSkill = idea.skills_needed?.some(skill => 
                skill.toLowerCase().includes(filters.skills.toLowerCase())
              );
              return hasSkill;
            }
            return true;
          })
          .map(idea => ({
            type: 'idea' as const,
            id: idea.id,
            title: idea.title,
            description: idea.description,
            tags: idea.tags,
            skills: idea.skills_needed,
            status: idea.status
          }));

        searchResults.push(...ideaResults);
      }

      // Search jobs
      if (filters.type === 'all' || filters.type === 'jobs') {
        let jobsQuery = supabase
          .from('jobs')
          .select('id, title, description, skills, location, status');

        if (searchQuery) {
          jobsQuery = jobsQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        if (filters.location) {
          jobsQuery = jobsQuery.ilike('location', `%${filters.location}%`);
        }

        if (filters.status) {
          jobsQuery = jobsQuery.eq('status', filters.status);
        }

        const { data: jobs } = await jobsQuery.limit(20);

        const jobResults = (jobs || [])
          .filter(job => {
            if (filters.skills) {
              const hasSkill = job.skills?.some(skill => 
                skill.toLowerCase().includes(filters.skills.toLowerCase())
              );
              return hasSkill;
            }
            return true;
          })
          .map(job => ({
            type: 'job' as const,
            id: job.id,
            title: job.title,
            description: job.description,
            skills: job.skills,
            location: job.location,
            status: job.status
          }));

        searchResults.push(...jobResults);
      }

      // Search users
      if (filters.type === 'all' || filters.type === 'users') {
        let usersQuery = supabase
          .from('profiles')
          .select('id, name, bio, role, skills, location');

        if (searchQuery) {
          usersQuery = usersQuery.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
        }

        if (filters.location) {
          usersQuery = usersQuery.ilike('location', `%${filters.location}%`);
        }

        const { data: users } = await usersQuery.limit(20);

        const userResults = (users || [])
          .filter(user => {
            if (filters.skills) {
              const hasSkill = user.skills?.some(skill => 
                skill.toLowerCase().includes(filters.skills.toLowerCase())
              );
              return hasSkill;
            }
            return true;
          })
          .map(user => ({
            type: 'user' as const,
            id: user.id,
            title: user.name,
            description: user.bio || '',
            name: user.name,
            role: user.role,
            skills: user.skills,
            location: user.location
          }));

        searchResults.push(...userResults);
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'idea':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'user':
        return <User className="w-5 h-5 text-green-500" />;
      default:
        return <SearchIcon className="w-5 h-5" />;
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'idea':
        return `/ideas/${result.id}`;
      case 'job':
        return `/jobs/${result.id}`;
      case 'user':
        return `/profile/${result.name}`;
      default:
        return '#';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Search</h1>
        <p className="text-lg text-slate-600">Find ideas, jobs, and talented people</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search for anything..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <Select value={filters.type} onValueChange={(value: any) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ideas">Ideas</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Skills (e.g. React)"
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
              />

              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />

              <Input
                placeholder="Status"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </h2>
          
          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <Link to={getResultLink(result)} className="block">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getResultIcon(result.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">
                            {result.title}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {result.type}
                          </Badge>
                          {result.status && (
                            <Badge variant="secondary">
                              {result.status}
                            </Badge>
                          )}
                        </div>
                        
                        {result.description && (
                          <p className="text-slate-600 mb-3 line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {result.skills && result.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {result.skills && result.skills.length > 4 && (
                              <span className="text-xs text-slate-500">
                                +{result.skills.length - 4} more
                              </span>
                            )}
                          </div>
                          
                          {result.location && (
                            <div className="flex items-center text-sm text-slate-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              {result.location}
                            </div>
                          )}
                        </div>
                        
                        {result.type === 'user' && result.role && (
                          <div className="mt-2">
                            <Badge variant="outline">
                              {result.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {result.type === 'user' && (
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {result.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : searchTerm.length > 2 || filters.skills || filters.location || filters.status ? (
        <div className="text-center py-12">
          <p className="text-slate-600">No results found. Try different search terms or filters.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">Start typing to search for ideas, jobs, and people.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
