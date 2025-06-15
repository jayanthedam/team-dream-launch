import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DeleteDropdown from './DeleteDropdown';

interface Job {
  id: string;
  title: string;
  description: string;
  full_description: string;
  project: string;
  location: string;
  type: string;
  compensation: string;
  skills: string[];
  time_commitment: string;
  experience_level: string;
  company_size: string;
  benefits: string[];
  status: string;
  applicants_count: number;
  created_at: string;
  author_id: string;
  profiles?: {
    name: string;
    email: string;
    role: string;
  };
}

interface JobCardProps {
  job: Job;
  onUpdate?: () => void;
}

const JobCard = ({ job, onUpdate }: JobCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user || isDeleting) return;

    setIsDeleting(true);
    try {
      // Only filter on primary key; RLS handles auth.
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully.",
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description:
          error?.message?.includes('violates row-level security policy')
            ? "You do not have permission to delete this job."
            : "Failed to delete job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user?.id === job.author_id;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium">
                {job.profiles?.name ? job.profiles.name.split(' ').map(n => n[0]).join('') : 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{job.profiles?.name || 'Company'}</p>
              <p className="text-sm text-slate-500">{job.profiles?.role || 'Employer'}</p>
            </div>
          </div>
          <DeleteDropdown 
            onDelete={handleDelete}
            isOwner={isOwner}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={job.status === 'Open' ? 'default' : 'secondary'} className="text-xs">
              {job.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {job.type}
            </Badge>
          </div>
          
          <Link to={`/jobs/${job.id}`}>
            <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
              {job.title}
            </CardTitle>
          </Link>
          
          <p className="text-sm text-slate-600 font-medium">{job.project}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm line-clamp-3">{job.description}</p>

        <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>{job.compensation}</span>
          </div>
          {job.time_commitment && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{job.time_commitment}</span>
            </div>
          )}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1 text-slate-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{job.applicants_count || 0} applicants</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">{job.experience_level}</span>
            <Link to={`/jobs/${job.id}`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
