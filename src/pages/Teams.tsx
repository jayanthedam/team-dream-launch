
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Team {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
  ideas: {
    title: string;
  };
  team_members: {
    user_id: string;
    role: string;
    profiles: {
      name: string;
    };
  }[];
  project_tasks: {
    status: string;
  }[];
}

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          ideas:project_id (title),
          team_members (
            user_id,
            role,
            profiles:user_id (name)
          ),
          project_tasks (status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskStats = (tasks: any[]) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    return { total, completed };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
          <p className="text-lg text-slate-600">Manage your project teams and collaborate</p>
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => {
          const taskStats = getTaskStats(team.project_tasks);
          
          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>
                      {team.ideas?.title && (
                        <span className="text-blue-600 font-medium">
                          Project: {team.ideas.title}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.description && (
                  <p className="text-slate-700 text-sm">{team.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {team.team_members.length} members
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {taskStats.completed}/{taskStats.total} tasks
                  </div>
                </div>

                <div className="flex -space-x-2">
                  {team.team_members.slice(0, 4).map((member, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {member.profiles?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.team_members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                      +{team.team_members.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Badge variant="outline" className="text-xs">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </Badge>
                  <Link to={`/teams/${team.id}`}>
                    <Button size="sm">View Team</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">
            {searchTerm ? 'No teams found matching your search.' : 'No teams found. Create your first team!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Teams;
