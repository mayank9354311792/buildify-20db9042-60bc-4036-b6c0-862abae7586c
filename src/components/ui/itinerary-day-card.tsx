
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity } from '@/lib/generate-itinerary';
import { cn } from '@/lib/utils';

interface ItineraryDayCardProps {
  dayNumber: number;
  date: string;
  activities: Activity[];
  className?: string;
}

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  dayNumber,
  date,
  activities,
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'food':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'sightseeing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'transportation':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'accommodation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'entertainment':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2 bg-primary/5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Day {dayNumber}</h3>
          <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 space-y-4">
        {activities.map((activity, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Separator className="my-3" />}
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{activity.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                  {activity.category && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getCategoryColor(activity.category))}>
                      {activity.category}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              {activity.location && (
                <div className="text-xs text-muted-foreground mt-1">
                  Location: {activity.location}
                </div>
              )}
              {activity.cost !== undefined && (
                <div className="text-xs font-medium mt-1">
                  Estimated cost: ${activity.cost}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default ItineraryDayCard;