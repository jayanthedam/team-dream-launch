
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Mail, Github, Linkedin, Globe, MessageCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PublicProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  // Mock user data - in real app this would be fetched by username
  const profileUser = {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Environmental Engineer & Product Manager',
    bio: 'Passionate about creating technology solutions for environmental challenges. 5+ years in product management with a focus on sustainability and green tech.',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnson.dev',
    github: 'github.com/sarahj',
    linkedin: 'linkedin.com/in/sarahj',
    joinedDate: 'November 2024',
    followers: 234,
    following: 189,
    projects: 12
  };

  const userSkills = [
    'Product Management', 'Environmental Science', 'React', 'Node.js', 'Data Analysis',
    'Sustainability', 'Mobile Development', 'UX Research', 'Team Leadership'
  ];

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

  const isOwnProfile = currentUser?.id === profileUser.id;

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
                  {profileUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">{profileUser.name}</h1>
                <p className="text-lg text-slate-600">{profileUser.role}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {profileUser.joinedDate}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileUser.location}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-slate-900">{profileUser.followers}</span>
                    <span className="text-slate-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{profileUser.following}</span>
                    <span className="text-slate-600 ml-1">following</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{profileUser.projects}</span>
                    <span className="text-slate-600 ml-1">projects</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!isOwnProfile && currentUser && (
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">{profileUser.bio}</p>
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
                  <span className="text-slate-700">{profileUser.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={profileUser.website} className="text-blue-600 hover:underline">{profileUser.website}</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="w-4 h-4 text-slate-400" />
                  <a href={`https://${profileUser.github}`} className="text-blue-600 hover:underline">{profileUser.github}</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-slate-400" />
                  <a href={`https://${profileUser.linkedin}`} className="text-blue-600 hover:underline">{profileUser.linkedin}</a>
                </div>
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
                {userSkills.map((skill) => (
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
