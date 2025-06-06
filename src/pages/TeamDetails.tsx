
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Users, Calendar, Settings, UserPlus, Mail } from 'lucide-react';
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
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    name: string;
    email: string;
    bio: string | null;
  };
}

const TeamDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeamDetails();
    }
  }, [id, user]);

  const fetchTeamDetails = async () => {
    if (!id) return;

    try {
      // Fetch team details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

      if (teamError) throw teamError;

      setTeam(teamData);

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles(name, email, bio)
        `)
        .eq('team_id', id);

      if (membersError) throw membersError;

      setMembers(membersData || []);

      // Check if current user is a member
      if (user) {
        const userIsMember = membersData?.some(member => member.user_id === user.id);
        setIsMember(!!userIsMember);
      }

    } catch (error) {
      console.error('Error fetching team details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user || !team) return;

    setIsJoining(true);

    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "You've successfully joined the team.",
      });

      // Refresh team details
      fetchTeamDetails();

    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Failed to join the team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Team not found</h2>
          <p className="text-slate-600 mb-6">The team you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === team.created_by;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/teams')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teams
        </Button>
        {isOwner && (
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Manage Team
          </Button>
        )}
      </div>

      {/* Team Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-20 h-20 mx-auto md:mx-0">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
                {team.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{team.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{team.member_count} member{team.member_count !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                </div>
                {team.is_public && (
                  <Badge variant="secondary">Public</Badge>
                )}
              </div>
              
              {team.description && (
                <p className="text-slate-700 mb-4">{team.description}</p>
              )}

              {team.tags && team.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {team.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {user && !isMember && team.is_public && (
                <Button 
                  onClick={handleJoinTeam}
                  disabled={isJoining}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isJoining ? 'Joining...' : 'Join Team'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Meet the people who make this team amazing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {member.profiles.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 truncate">
                        {member.profiles.name}
                      </p>
                      <Badge 
                        variant={member.role === 'owner' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {member.profiles.bio || 'No bio available'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDetails;
