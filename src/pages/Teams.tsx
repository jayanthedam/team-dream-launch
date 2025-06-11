import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, Calendar, Search, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
  member_count: number;
  is_public: boolean;
  tags: string[] | null;
  creator?: {
    name: string;
  };
}

const Teams = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          profiles!teams_created_by_fkey(name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const teamsWithCreator = data?.map(team => ({
        ...team,
        creator: team.profiles ? { name: team.profiles.name } : null
      })) || [];

      setTeams(teamsWithCreator);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teams. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams 👥</h1>
          <p className="text-lg text-slate-600">Join teams and collaborate on amazing projects</p>
        </div>
        {user && (
          <Link to="/create-team">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search teams by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{teams.length} active teams</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm ? 'No teams found' : 'No teams yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms to find teams.'
                : 'Be the first to create a team and start collaborating!'
              }
            </p>
            {user && !searchTerm && (
              <Link to="/create-team">
                <Button>Create First Team</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={`/teams/${team.id}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                          {team.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <p className="text-sm text-slate-600 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {team.member_count} member{team.member_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">
                    {team.description || 'No description available'}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    {team.tags && team.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {team.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {team.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{team.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                      </div>
                      {team.creator && (
                        <span>by {team.creator.name}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
