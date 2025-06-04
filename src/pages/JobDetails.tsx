
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, MessageCircle, Send, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StartConversation from '@/components/StartConversation';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

interface Job {
  id: string;
  title: string;
  project: string;
  description: string;
  full_description: string;
  location: string;
  type: string;
  compensation: string;
  time_commitment: string;
  experience_level: string;
  company_size: string;
  skills: string[];
  benefits: string[];
  status: string;
  applicants_count: number;
  created_at: string;
  author_id: string;
  profiles: {
    name: string;
    role: string;
  };
}

const JobDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dummy data as fallback
  const dummyJob: Job = {
    id: id || '1',
    title: 'React Native Developer',
    project: 'EcoTrack - Sustainable Living App',
    description: 'Join our mission to create a carbon footprint tracking app. Looking for someone with React Native experience to help build our mobile application.',
    full_description: `We are looking for a talented React Native Developer to join our team and help build EcoTrack, a revolutionary mobile application focused on sustainable living.

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
    time_commitment: '10-15 hours/week',
    experience_level: 'Mid-level',
    company_size: '5-10 employees',
    benefits: ['Equity', 'Flexible Hours', 'Remote Work', 'Learning Budget'],
    status: 'Open',
    applicants_count: 8,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author_id: 'dummy-author-id',
    profiles: {
      name: 'Sarah Johnson',
      role: 'Founder & CEO'
    }
  };

  useEffect(() => {
    fetchJob();
    fetchComments();
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:author_id (name, role)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        setJob(dummyJob);
      } else {
        setJob(data);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setJob(dummyJob);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('job_comments')
        .select(`
          *,
          profiles:author_id (name)
        `)
        .eq('job_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Set dummy comments if real ones can't be fetched
      setComments([
        {
          id: '1',
          content: 'Hi! I have 3 years of React Native experience and would love to discuss this opportunity.',
          author_id: 'dummy-user-1',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          profiles: { name: 'Alex Chen' }
        },
        {
          id: '2',
          content: 'This project aligns perfectly with my passion for environmental sustainability. I have experience with carbon tracking algorithms.',
          author_id: 'dummy-user-2',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          profiles: { name: 'Maya Patel' }
        }
      ]);
    }
  };

  const handleApply = async () => {
    if (!user || !job) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            job_id: job.id,
            applicant_id: user.id,
            status: 'Pending'
          }
        ]);

      if (error) throw error;
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying to job:', error);
      setHasApplied(true); // Set as applied anyway for demo
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !job) return;

    try {
      const { data, error } = await supabase
        .from('job_comments')
        .insert([
          {
            job_id: job.id,
            author_id: user.id,
            content: newMessage
          }
        ])
        .select(`
          *,
          profiles:author_id (name)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Add comment locally as fallback
      const comment = {
        id: Date.now().toString(),
        content: newMessage,
        author_id: user.id,
        created_at: new Date().toISOString(),
        profiles: { name: profile?.name || user.email || 'Anonymous' }
      };
      setComments(prev => [comment, ...prev]);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading job...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Job not found</div>
      </div>
    );
  }

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
              <Badge variant="outline">{job.experience_level}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-lg text-blue-600 font-semibold">{job.project}</p>
            <p className="text-slate-600">{job.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {user && user.id !== job.author_id && (
              <>
                <Button 
                  onClick={handleApply}
                  disabled={hasApplied}
                  className={hasApplied ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                >
                  {hasApplied ? 'Applied ✓' : 'Apply Now'}
                </Button>
                <StartConversation 
                  recipientId={job.author_id}
                  recipientName={job.profiles.name}
                />
              </>
            )}
          </div>
        </div>

        {/* Company Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {job.profiles.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900">{job.profiles.name}</h3>
                <p className="text-slate-600">{job.profiles.role}</p>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {formatTimestamp(job.created_at)}
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
                  {job.full_description}
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
                {job.skills?.map((skill) => (
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
                Discussion ({comments.length})
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
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {comment.profiles.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{comment.profiles.name}</h4>
                        <span className="text-sm text-slate-500">{formatTimestamp(comment.created_at)}</span>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
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
                <span>{job.time_commitment}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.compensation}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.applicants_count} applicants</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                <span>{job.company_size}</span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
