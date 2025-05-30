
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'React Native Developer',
      project: 'EcoTrack - Sustainable Living App',
      description: 'Join our mission to create a carbon footprint tracking app. Looking for someone with React Native experience.',
      location: 'Remote',
      type: 'Part-time',
      compensation: 'Equity + Revenue Share',
      skills: ['React Native', 'JavaScript', 'Mobile Development'],
      timeCommitment: '10-15 hours/week',
      posted: '2 days ago',
      applicants: 8
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      project: 'AI-Powered Learning Platform',
      description: 'Design intuitive interfaces for our personalized education platform. Experience with educational apps preferred.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      compensation: '$70k-90k + Equity',
      skills: ['Figma', 'User Research', 'Prototyping', 'Education Design'],
      timeCommitment: '40 hours/week',
      posted: '1 week ago',
      applicants: 15
    },
    {
      id: 3,
      title: 'Backend Developer',
      project: 'Local Business Network',
      description: 'Build scalable APIs for connecting local businesses. GraphQL and Node.js experience required.',
      location: 'Remote',
      type: 'Contract',
      compensation: '$50-75/hour',
      skills: ['Node.js', 'GraphQL', 'MongoDB', 'API Design'],
      timeCommitment: '20-30 hours/week',
      posted: '3 days ago',
      applicants: 12
    },
    {
      id: 4,
      title: 'Machine Learning Engineer',
      project: 'Smart Health Monitoring',
      description: 'Develop ML models for health prediction and monitoring. Healthcare domain knowledge is a plus.',
      location: 'New York, NY',
      type: 'Full-time',
      compensation: '$90k-120k + Benefits',
      skills: ['Python', 'TensorFlow', 'Healthcare', 'Data Science'],
      timeCommitment: '40 hours/week',
      posted: '5 days ago',
      applicants: 22
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      project: 'Blockchain Voting System',
      description: 'Set up secure infrastructure for our blockchain voting platform. Security focus essential.',
      location: 'Austin, TX',
      type: 'Part-time',
      compensation: 'Token Allocation + Equity',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Blockchain', 'Security'],
      timeCommitment: '15-20 hours/week',
      posted: '1 day ago',
      applicants: 6
    },
    {
      id: 6,
      title: 'Product Manager',
      project: 'Mental Health Support Network',
      description: 'Lead product strategy for our mental health platform. Psychology background preferred.',
      location: 'Remote',
      type: 'Part-time',
      compensation: 'Equity + Revenue Share',
      skills: ['Product Strategy', 'Healthcare', 'User Research', 'Psychology'],
      timeCommitment: '10-15 hours/week',
      posted: '4 days ago',
      applicants: 9
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || 
                           (locationFilter === 'remote' && job.location === 'Remote') ||
                           (locationFilter === 'onsite' && job.location !== 'Remote');
    
    const matchesType = typeFilter === 'all' || job.type.toLowerCase().replace('-', '') === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Project Opportunities</h1>
        <p className="text-lg text-slate-600">Find your next collaboration and join innovative projects</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search positions, projects, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-slate-600">
          {filteredJobs.length} opportunities available
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.project}</p>
                    <p className="text-slate-600">{job.description}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                    <div className="text-sm text-slate-500">
                      Posted {job.posted}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-slate-100">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.timeCommitment}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.compensation}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.applicants} applicants
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <Button variant="outline">
                    Learn More
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No opportunities found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setLocationFilter('all');
                setTypeFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Jobs;
