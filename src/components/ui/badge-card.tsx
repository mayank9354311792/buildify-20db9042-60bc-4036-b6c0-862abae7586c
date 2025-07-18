
import React from 'react';
import { TravelBadge } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';
import { Award } from 'lucide-react';

interface BadgeCardProps {
  badge: TravelBadge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {badge.badge_image_url ? (
          <img 
            src={badge.badge_image_url} 
            alt={badge.badge_name} 
            className="w-8 h-8 object-contain"
          />
        ) : (
          <Award className="h-6 w-6 text-primary" />
        )}
      </div>
      <h3 className="font-medium text-sm">{badge.badge_name}</h3>
      {badge.badge_description && (
        <p className="text-xs text-muted-foreground mt-1">
          {badge.badge_description}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        {formatDate(badge.earned_at)}
      </p>
    </div>
  );
};

export default BadgeCard;