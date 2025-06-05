
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Lightbulb, Briefcase, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface SearchResult {
  type: 'idea' | 'job' | 'user';
  id: string;
  title: string;
  description: string;
  tags?: string[];
  skills?: string[];
  name?: string;
  role?: string;
}

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchQuery = searchTerm.toLowerCase();
      
      // Search ideas
      const { data: ideas } = await supabase
        .from('ideas')
        .select('id, title, description, tags, skills_needed')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      // Search jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, description, skills')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, bio, role, skills')
        .or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
        .limit(10);

      const searchResults: SearchResult[] = [
        ...(ideas || []).map(idea => ({
          type: 'idea' as const,
          id: idea.id,
          title: idea.title,
          description: idea.description,
          tags: idea.tags,
          skills: idea.skills_needed
        })),
        ...(jobs || []).map(job => ({
          type: 'job' as const,
          id: job.id,
          title: job.title,
          description: job.description,
          skills: job.skills
        })),
        ...(users || []).map(user => ({
          type: 'user' as const,
          id: user.id,
          title: user.name,
          description: user.bio || '',
          name: user.name,
          role: user.role,
          skills: user.skills
        }))
      ];

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
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'user':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Search className="w-4 h-4" />;
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
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search ideas, jobs, and people..."
          className="pl-10 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(results.length > 0 || loading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-slate-500">Searching...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {results.map((result) => (
                  <Link key={`${result.type}-${result.id}`} to={getResultLink(result)}>
                    <div className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-slate-900 truncate">
                              {result.title}
                            </h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {result.type}
                            </Badge>
                          </div>
                          {result.description && (
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                          {result.skills && result.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {result.skills.length > 3 && (
                                <span className="text-xs text-slate-500">
                                  +{result.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          {result.type === 'user' && result.role && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {result.role}
                              </Badge>
                            </div>
                          )}
                        </div>
                        {result.type === 'user' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {result.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
