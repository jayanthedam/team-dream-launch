
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SubmitJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    description: '',
    fullDescription: '',
    location: '',
    type: '',
    compensation: '',
    timeCommitment: '',
    experienceLevel: '',
    companySize: '',
    skills: [] as string[],
    benefits: [] as string[]
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a job posting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            project: formData.project,
            description: formData.description,
            full_description: formData.fullDescription,
            location: formData.location,
            type: formData.type,
            compensation: formData.compensation,
            time_commitment: formData.timeCommitment,
            experience_level: formData.experienceLevel,
            company_size: formData.companySize,
            skills: formData.skills,
            benefits: formData.benefits,
            author_id: user.id,
            status: 'Open'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Your job posting has been created and is now live.",
      });

      navigate('/jobs');
    } catch (error) {
      console.error('Error submitting job:', error);
      toast({
        title: "Error posting job",
        description: "There was an error creating your job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Please log in to post a job</h2>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Button variant="ghost" onClick={() => navigate('/jobs')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Post a Job</CardTitle>
          <CardDescription>
            Share your job opportunity and find the perfect candidate for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project/Company</Label>
              <Input
                id="project"
                placeholder="e.g. TechCorp Inc. or AI Startup Project"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the role"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Job Description</Label>
              <Textarea
                id="fullDescription"
                placeholder="Provide a detailed description of the role, responsibilities, and requirements"
                value={formData.fullDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Remote, New York, or Hybrid"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compensation">Compensation</Label>
                <Input
                  id="compensation"
                  placeholder="e.g. $80k-$120k or $50/hour"
                  value={formData.compensation}
                  onChange={(e) => setFormData(prev => ({ ...prev, compensation: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeCommitment">Time Commitment</Label>
                <Select value={formData.timeCommitment} onValueChange={(value) => setFormData(prev => ({ ...prev, timeCommitment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-20 hours/week">10-20 hours/week</SelectItem>
                    <SelectItem value="20-30 hours/week">20-30 hours/week</SelectItem>
                    <SelectItem value="30-40 hours/week">30-40 hours/week</SelectItem>
                    <SelectItem value="40+ hours/week">40+ hours/week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                    <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                    <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                    <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                    <SelectItem value="500+ employees">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a required skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Benefits & Perks</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a benefit or perk"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits.map((benefit) => (
                  <Badge key={benefit} variant="outline" className="px-3 py-1">
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting Job...' : 'Post Job'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitJob;
