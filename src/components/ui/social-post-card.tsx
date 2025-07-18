
import React, { useState } from 'react';
import { Post, User, Trip } from '../../lib/supabase';
import { formatRelativeTime } from '../../lib/utils';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';

interface SocialPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onCloneTrip?: (tripId: string) => void;
  isLiked?: boolean;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ 
  post, 
  onLike, 
  onCloneTrip,
  isLiked = false
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  
  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
    
    if (!liked) {
      setLikesCount(likesCount + 1);
    } else {
      setLikesCount(Math.max(0, likesCount - 1));
    }
    
    setLiked(!liked);
  };
  
  const handleCloneTrip = () => {
    if (onCloneTrip && post.trip_id) {
      onCloneTrip(post.trip_id);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          {post.user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="font-medium">{post.user?.username || 'User'}</div>
          <div className="text-xs text-muted-foreground">{formatRelativeTime(post.created_at)}</div>
        </div>
      </div>
      
      {/* Post Image */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="relative aspect-video">
          <img 
            src={post.image_urls[0]} 
            alt="Trip" 
            className="w-full h-full object-cover"
          />
          {post.trip && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {post.trip.destination}
            </div>
          )}
        </div>
      )}
      
      {/* Post Content */}
      <div className="p-4">
        {post.content && (
          <p className="mb-3">{post.content}</p>
        )}
        
        {/* Post Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-sm"
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              <span>{likesCount}</span>
            </button>
            
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span>0</span>
            </button>
            
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          {post.trip_id && onCloneTrip && (
            <button 
              onClick={handleCloneTrip}
              className="py-1 px-3 rounded-md bg-primary text-white text-sm"
            >
              Clone Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPostCard;