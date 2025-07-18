
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SocialPost } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface SocialPostCardProps {
  post: SocialPost;
  onCloneTrip: (tripId: string) => void;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ post, onCloneTrip }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback>{post.user?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.user?.username}</div>
            <div className="text-xs text-muted-foreground">{formatDate(post.created_at)}</div>
          </div>
          {post.user?.username === 'travelpro' && (
            <Badge className="ml-auto" variant="secondary">Creator</Badge>
          )}
        </div>
      </CardHeader>
      
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="relative aspect-video">
          <img 
            src={post.image_urls[0]} 
            alt="Trip" 
            className="object-cover w-full h-full"
          />
          {post.trip && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
              {post.trip.destination}
            </div>
          )}
        </div>
      )}
      
      <CardContent className="py-3">
        {post.content && (
          <p className="text-sm">{post.content}</p>
        )}
        
        {post.trip && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {post.trip.start_date && post.trip.end_date ? 
                `${formatDate(post.trip.start_date)} - ${formatDate(post.trip.end_date)}` : 
                'Trip dates not specified'}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <Heart size={16} />
            <span>{post.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <MessageCircle size={16} />
            <span>0</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <Share2 size={16} />
          </Button>
        </div>
        
        {post.trip && (
          <Button 
            size="sm" 
            onClick={() => onCloneTrip(post.trip_id)}
            className="text-xs"
          >
            Clone My Trip
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SocialPostCard;