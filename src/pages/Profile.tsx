
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, X, Plus, MapPin, Calendar, Mail, Github, Linkedin, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ActivityCalendar from '@/components/ActivityCalendar';

const Profile = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || 'San Francisco, CA',
    website: profile?.website || 'https://johndoe.dev',
    github: profile?.github || 'github.com/johndoe',
    linkedin: profile?.linkedin || 'linkedin.com/in/johndoe'
  });

  const userProjects = [
    {
      id: 1,
      title: 'EcoTrack - Sustainable Living App',
      role: 'Founder & Lead Developer',
      status: 'Active',
      collaborators: 3,
      description: 'Carbon footprint tracking application helping users live more sustainably'
    },
    {
      id: 2,
      title: 'Local Business Network',
      role: 'Backend Developer',
      status: 'Development',
      collaborators: 5,
      description: 'Platform connecting local businesses with their communities'
    }
  ];

  const skills = [
    'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 
    'GraphQL', 'React Native', 'Python', 'Machine Learning'
  ];

  const [userSkills, setUserSkills] = useState(profile?.skills || skills.slice(0, 6));
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    // In real app, this would update the user profile via API
    console.log('Saving profile:', editData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !userSkills.includes(newSkill.trim())) {
      setUserSkills([...userSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = profile?.name || user.email || 'User';
  const userInitials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                )}
                <p className="text-slate-600">{profile?.role || 'Member'}</p>
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined December 2024
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-slate-700">
                  {profile?.bio || 'No bio added yet.'}
                </p>
              )}
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
                  <span className="text-slate-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-slate-700">{editData.location}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  {isEditing ? (
                    <Input
                      value={editData.website}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                      placeholder="Website"
                    />
                  ) : (
                    <a href={editData.website} className="text-blue-600 hover:underline">{editData.website}</a>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="w-4 h-4 text-slate-400" />
                  {isEditing ? (
                    <Input
                      value={editData.github}
                      onChange={(e) => setEditData({...editData, github: e.target.value})}
                      placeholder="GitHub"
                    />
                  ) : (
                    <a href={`https://${editData.github}`} className="text-blue-600 hover:underline">{editData.github}</a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button size="sm" onClick={handleAddSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
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

        <TabsContent value="activity">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Activity Feed Coming Soon</h3>
              <p className="text-slate-600">Track your project contributions, comments, and collaborations</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
