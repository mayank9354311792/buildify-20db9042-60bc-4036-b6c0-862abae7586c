
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialPostCardProps {
  id: string;
  username: string;
  avatarUrl?: string;
  destination: string;
  content: string;
  imageUrls: string[];
  likesCount: number;
  isLiked?: boolean;
  isCreator?: boolean;
  earnings?: number;
  className?: string;
  onLike?: (id: string) => void;
  onCloneTrip?: (id: string) => void;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({
  id,
  username,
  avatarUrl,
  destination,
  content,
  imageUrls,
  likesCount,
  isLiked = false,
  isCreator = false,
  earnings,
  className,
  onLike,
  onCloneTrip,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-medium">{username}</span>
            {isCreator && (
              <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 h-5">
                Creator
              </Badge>
            )}
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{destination}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {imageUrls.length > 0 && (
          <div className="relative aspect-video bg-muted">
            <img 
              src={imageUrls[0]} 
              alt={`${destination} trip`} 
              className="w-full h-full object-cover"
            />
            {imageUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-background/80 text-foreground rounded-full px-2 py-1 text-xs">
                +{imageUrls.length - 1} more
              </div>
            )}
          </div>
        )}
        <div className="p-4 pt-3">
          <p className="text-sm">{content}</p>
          {isCreator && earnings !== undefined && (
            <div className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
              Earnings: ${earnings.toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "flex items-center gap-1 px-2",
              isLiked && "text-red-500 dark:text-red-400"
            )}
            onClick={() => onLike?.(id)}
          >
            <Heart className="h-4 w-4" />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-primary border-primary hover:bg-primary/10"
          onClick={() => onCloneTrip?.(id)}
        >
          Clone My Trip
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialPostCard;