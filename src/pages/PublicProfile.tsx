
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Mail, Github, Linkedin, Globe, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StartConversation from '@/components/StartConversation';
import ActivityCalendar from '@/components/ActivityCalendar';

interface ProfileData {
  id: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  email: string;
  role: string;
  created_at: string;
  skills: string[];
}

const PublicProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Static backup data
  const staticBackup = {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Environmental Engineer & Product Manager',
    bio: 'Passionate about creating technology solutions for environmental challenges. 5+ years in product management with a focus on sustainability and green tech.',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnson.dev',
    github: 'github.com/sarahj',
    linkedin: 'linkedin.com/in/sarahj',
    created_at: '2024-11-01T00:00:00Z',
    skills: ['Product Management', 'Environmental Science', 'React', 'Node.js', 'Data Analysis', 'Sustainability']
  };

  const userProjects = [
    {
      id: 1,
      title: 'EcoTrack - Sustainable Living App',
      role: 'Founder & Lead Product Manager',
      status: 'Active',
      collaborators: 3,
      description: 'Carbon footprint tracking application helping users live more sustainably'
    },
    {
      id: 2,
      title: 'Green Energy Calculator',
      role: 'Product Manager',
      status: 'Completed',
      collaborators: 2,
      description: 'Tool for calculating potential savings from renewable energy adoption'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'idea',
      title: 'Posted new idea: Smart Waste Management System',
      timestamp: '2 days ago'
    },
    {
      id: 2,
      type: 'comment',
      title: 'Commented on "AI-Powered Learning Platform"',
      timestamp: '5 days ago'
    },
    {
      id: 3,
      type: 'collaboration',
      title: 'Joined project: Urban Farming Network',
      timestamp: '1 week ago'
    }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        
        // Try to fetch profile by username/name first
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('name', `%${username.replace('-', ' ')}%`)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        if (data) {
          setProfileData(data);
        } else {
          // Use static backup if no data found
          setProfileData(staticBackup);
        }
      } catch (error) {
        console.error('Error:', error);
        setProfileData(staticBackup);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Profile not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileData.id;
  const joinedDate = new Date(profileData.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const followers = Math.floor(Math.random() * 500) + 50;
  const following = Math.floor(Math.random() * 300) + 20;
  const projects = Math.floor(Math.random() * 20) + 5;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => window.history.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">{profileData.name}</h1>
                <p className="text-lg text-slate-600">{profileData.role}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {joinedDate}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileData.location}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-slate-900">{followers}</span>
                    <span className="text-slate-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{following}</span>
                    <span className="text-slate-600 ml-1">following</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{projects}</span>
                    <span className="text-slate-600 ml-1">projects</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!isOwnProfile && currentUser && (
              <div className="flex gap-2">
                <StartConversation 
                  recipientId={profileData.id} 
                  recipientName={profileData.name}
                  triggerText="Message"
                  variant="outline"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>
            )}
            
            {isOwnProfile && (
              <Link to="/profile">
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">{profileData.bio}</p>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{profileData.email}</span>
                </div>
                {profileData.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a href={profileData.website} className="text-blue-600 hover:underline">{profileData.website}</a>
                  </div>
                )}
                {profileData.github && (
                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-slate-400" />
                    <a href={`https://${profileData.github}`} className="text-blue-600 hover:underline">{profileData.github}</a>
                  </div>
                )}
                {profileData.linkedin && (
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-slate-400" />
                    <a href={`https://${profileData.linkedin}`} className="text-blue-600 hover:underline">{profileData.linkedin}</a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(profileData.skills || []).map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="space-y-4">
            {userProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                      <p className="text-blue-600 font-medium">{project.role}</p>
                      <p className="text-slate-600">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <span>{project.collaborators} collaborators</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 py-3 border-b border-slate-100 last:border-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Reviews & Recommendations</h3>
              <p className="text-slate-600">Peer reviews and project recommendations will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicProfile;
