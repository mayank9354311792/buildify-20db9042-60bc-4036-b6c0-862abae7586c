
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  locked?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  imageUrl,
  className,
  locked = false,
}) => {
  return (
    <Card className={cn("overflow-hidden", className, locked && "opacity-50")}>
      <CardContent className="p-3 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-12 h-12 object-contain" />
          ) : (
            <div className="text-2xl font-bold text-primary">{name.charAt(0)}</div>
          )}
        </div>
        <h3 className="font-medium text-sm">{name}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <span className="text-xs font-medium">Locked</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard;