
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Temporarily disable team functionality until tables are created
const Teams = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
          <p className="text-lg text-slate-600">Manage your project teams and collaborate</p>
        </div>
        {user && (
          <Link to="/create-team">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Teams Grid - Placeholder */}
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Teams feature coming soon</h3>
          <p className="text-slate-600">
            The teams functionality requires additional database setup. 
            Teams will allow you to collaborate on projects with other members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Teams;
