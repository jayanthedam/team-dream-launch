
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, ArrowLeft, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreateTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a team.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          description: formData.description,
          is_public: formData.isPublic,
          tags: formData.tags,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Your team has been created successfully.",
      });

      navigate(`/teams/${data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create your team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Please log in to create a team</h2>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/teams')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">Create Your Team 👥</h1>
            <p className="text-lg text-slate-600 mt-2">
              Build a team and start collaborating on amazing projects
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Team Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Team Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your team name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your team's mission, goals, and what you're working on..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Tags and Visibility */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Tags & Settings</h3>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Add a tag (e.g., Frontend, Design, AI)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="h-10"
                    />
                    <Button type="button" onClick={addTag} size="sm" className="px-4">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Public Team</Label>
                    <p className="text-xs text-slate-600">
                      Allow anyone to discover and join your team
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name.trim()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeam;
