
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, MapPin, DollarSign, Lightbulb, Briefcase } from 'lucide-react';

interface FeedItemProps {
  item: {
    id: number;
    type: 'post' | 'idea' | 'job';
    author: string;
    authorRole?: string;
    content?: string;
    title?: string;
    description?: string;
    location?: string;
    compensation?: string;
    tags?: string[];
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
  };
}

const FeedItem = ({ item }: FeedItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const getIcon = () => {
    switch (item.type) {
      case 'idea':
        return <Lightbulb className="w-4 h-4" />;
      case 'job':
        return <Briefcase className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDetailLink = () => {
    switch (item.type) {
      case 'idea':
        return `/ideas/${item.id}`;
      case 'job':
        return `/jobs/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback style={{ background: 'linear-gradient(to right, #303744, #B4C5E4)' }} className="text-white">
              {item.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${item.author.toLowerCase().replace(' ', '-')}`} className="font-semibold text-slate-900 hover:text-blue-600">
                {item.author}
              </Link>
              {item.type !== 'post' && (
                <Badge variant="outline" className="text-xs" style={{ borderColor: '#B4C5E4', color: '#303744' }}>
                  {getIcon()}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
              )}
            </div>
            {item.authorRole && (
              <p className="text-sm text-slate-600">{item.authorRole}</p>
            )}
            <p className="text-xs text-slate-500">{item.timestamp}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        {item.type === 'post' && item.content && (
          <p className="text-slate-700">{item.content}</p>
        )}

        {(item.type === 'idea' || item.type === 'job') && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-slate-900">{item.title}</h3>
            <p className="text-slate-700">{item.description}</p>
            
            {item.type === 'job' && (
              <div className="flex items-center gap-4 text-sm text-slate-600">
                {item.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </div>
                )}
                {item.compensation && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {item.compensation}
                  </div>
                )}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs" style={{ backgroundColor: '#B4C5E4', color: '#303744' }}>
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs" style={{ borderColor: '#B4C5E4', color: '#303744' }}>
                    +{item.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <Link to={getDetailLink()}>
              <Button variant="outline" size="sm" className="mt-2" style={{ borderColor: '#B4C5E4', color: '#303744' }}>
                View Details
              </Button>
            </Link>
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-slate-600 hover:text-red-600 ${isLiked ? 'text-red-600' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              <MessageCircle className="w-4 h-4 mr-1" />
              {item.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-green-600">
              <Share2 className="w-4 h-4 mr-1" />
              {item.shares}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedItem;
