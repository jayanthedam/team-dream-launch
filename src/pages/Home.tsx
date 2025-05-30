
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Users, Rocket, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const featuredIdeas = [
    {
      id: 1,
      title: 'EcoTrack - Sustainable Living App',
      description: 'Help users track their carbon footprint and discover eco-friendly alternatives',
      author: 'Sarah Johnson',
      tags: ['React', 'Node.js', 'Environment'],
      collaborators: 3,
      status: 'Active'
    },
    {
      id: 2,
      title: 'AI-Powered Learning Platform',
      description: 'Personalized education platform using machine learning algorithms',
      author: 'Alex Chen',
      tags: ['Python', 'Machine Learning', 'Education'],
      collaborators: 5,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Local Business Network',
      description: 'Connect local businesses with customers and service providers',
      author: 'Maria Rodriguez',
      tags: ['React Native', 'GraphQL', 'Business'],
      collaborators: 2,
      status: 'Planning'
    }
  ];

  const stats = [
    { label: 'Active Projects', value: '127', icon: Rocket },
    { label: 'Collaborators', value: '1,240', icon: Users },
    { label: 'Success Stories', value: '89', icon: Star },
    { label: 'Growth Rate', value: '34%', icon: TrendingUp }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
              Where{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Innovation
              </span>{' '}
              Meets{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Collaboration
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of innovators, developers, and creators building the future together. 
              Share your ideas, find collaborators, and turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/ideas">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Explore Ideas
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/ideas">
                    <Button size="lg" variant="outline">
                      Browse Ideas
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Ideas Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Ideas</h2>
          <p className="text-lg text-slate-600">Discover innovative projects looking for collaborators</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredIdeas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <Badge variant={idea.status === 'Active' ? 'default' : 'secondary'}>
                    {idea.status}
                  </Badge>
                </div>
                <CardDescription className="text-slate-600">
                  {idea.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      by {idea.author}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-1" />
                      {idea.collaborators} collaborators
                    </div>
                  </div>
                  <Link to={`/ideas/${idea.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/ideas">
            <Button size="lg" variant="outline">
              View All Ideas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Next Project?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join our community of innovators and turn your ideas into reality
            </p>
            {user ? (
              <Link to="/ideas">
                <Button size="lg" variant="secondary">
                  Share Your Idea
                  <Lightbulb className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Join CollabOppt
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
