
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, MessageCircle, Send, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Alex Chen',
      text: 'Hi! I have 3 years of React Native experience and would love to discuss this opportunity.',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      user: 'Maya Patel',
      text: 'This project aligns perfectly with my passion for environmental sustainability. I have experience with carbon tracking algorithms.',
      createdAt: '5 hours ago'
    }
  ]);

  // Mock job data - in real app this would be fetched by ID
  const job = {
    id: parseInt(id || '1'),
    title: 'React Native Developer',
    project: 'EcoTrack - Sustainable Living App',
    description: 'Join our mission to create a carbon footprint tracking app. Looking for someone with React Native experience to help build our mobile application.',
    fullDescription: `We are looking for a talented React Native Developer to join our team and help build EcoTrack, a revolutionary mobile application focused on sustainable living.

    Key Responsibilities:
    • Develop and maintain React Native mobile application
    • Implement carbon footprint tracking features
    • Integrate with backend APIs for real-time data
    • Collaborate with UX/UI designers for seamless user experience
    • Optimize app performance and user engagement
    
    What we offer:
    • Opportunity to work on meaningful environmental impact
    • Flexible working hours and remote-first culture
    • Equity participation in a growing startup
    • Learning and development opportunities
    • Collaborative and innovative team environment
    
    This is a unique opportunity to combine your technical skills with environmental impact, helping millions of users live more sustainably.`,
    location: 'Remote',
    type: 'Part-time',
    compensation: 'Equity + Revenue Share',
    skills: ['React Native', 'JavaScript', 'Mobile Development', 'REST APIs', 'Git'],
    timeCommitment: '10-15 hours/week',
    posted: '2 days ago',
    applicants: 8,
    author: 'Sarah Johnson',
    authorRole: 'Founder & CEO',
    companySize: '5-10 employees',
    experienceLevel: 'Mid-level',
    benefits: ['Equity', 'Flexible Hours', 'Remote Work', 'Learning Budget']
  };

  const handleApply = () => {
    setHasApplied(true);
    // In real app, this would submit application
    console.log('Applied to job:', job.id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: messages.length + 1,
        user: profile?.name || user.email || 'Anonymous',
        text: newMessage,
        createdAt: 'Just now'
      };
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/jobs">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                {job.type}
              </Badge>
              <Badge variant="outline">{job.experienceLevel}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-lg text-blue-600 font-semibold">{job.project}</p>
            <p className="text-slate-600">{job.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <Button 
                onClick={handleApply}
                disabled={hasApplied}
                className={hasApplied ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
              >
                {hasApplied ? 'Applied ✓' : 'Apply Now'}
              </Button>
            )}
          </div>
        </div>

        {/* Company Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {job.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900">{job.author}</h3>
                <p className="text-slate-600">{job.authorRole}</p>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {job.posted}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {job.fullDescription}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discussion ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Send Message */}
              {user ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Ask questions or express interest..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 mb-3">Join the discussion</p>
                  <Link to="/login">
                    <Button>Sign in to comment</Button>
                  </Link>
                </div>
              )}

              <Separator />

              {/* Messages List */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{message.user}</h4>
                        <span className="text-sm text-slate-500">{message.createdAt}</span>
                      </div>
                      <p className="text-slate-700">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.timeCommitment}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.compensation}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.applicants} applicants</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.companySize}</span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="block text-center py-2">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
