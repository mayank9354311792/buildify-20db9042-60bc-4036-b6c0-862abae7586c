
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../../lib/supabase';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
          {badge.badge_image_url ? (
            <img 
              src={badge.badge_image_url} 
              alt={badge.badge_name} 
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="text-2xl font-bold text-primary">
              {badge.badge_name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm text-center">{badge.badge_name}</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {badge.badge_description || 'Achievement unlocked!'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(badge.earned_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default BadgeCard;