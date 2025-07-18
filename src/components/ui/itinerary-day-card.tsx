
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ItineraryDay, Activity } from '@/lib/generate-itinerary';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryDayCardProps {
  day: ItineraryDay;
  expanded?: boolean;
}

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  // Get color based on activity category
  const getCategoryColor = () => {
    switch (activity.category) {
      case 'food': return 'bg-orange-500';
      case 'sightseeing': return 'bg-blue-500';
      case 'transportation': return 'bg-gray-500';
      case 'accommodation': return 'bg-purple-500';
      case 'entertainment': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start">
        <div className="text-sm font-medium w-16 text-muted-foreground">
          {activity.time}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{activity.title}</h4>
            {activity.category && (
              <Badge className={`text-xs ${getCategoryColor()}`}>
                {activity.category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {activity.description}
          </p>
          {activity.location && (
            <p className="text-xs text-muted-foreground mt-1">
              📍 {activity.location}
            </p>
          )}
          {activity.cost !== undefined && activity.cost > 0 && (
            <p className="text-xs font-medium mt-1">
              {formatCurrency(activity.cost)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Calculate total cost for the day
  const totalCost = day.activities.reduce((sum, activity) => {
    return sum + (activity.cost || 0);
  }, 0);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            Day {day.day_number}
            <span className="text-sm font-normal text-muted-foreground">
              {formatDate(day.date)}
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div>{day.activities.length} activities</div>
          <div className="font-medium">{formatCurrency(totalCost)}</div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Separator className="mb-4" />
          {day.activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default ItineraryDayCard;