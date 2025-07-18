
import React, { useState } from 'react';
import { ItineraryDay, Activity } from '../../lib/generate-itinerary';
import { formatDate, formatCurrency } from '../../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryDayCardProps {
  day: ItineraryDay;
  expanded?: boolean;
}

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  // Get color based on activity category
  const getCategoryColor = () => {
    switch (activity.category) {
      case 'food': return 'bg-orange-500 text-white';
      case 'sightseeing': return 'bg-blue-500 text-white';
      case 'transportation': return 'bg-gray-500 text-white';
      case 'accommodation': return 'bg-purple-500 text-white';
      case 'entertainment': return 'bg-green-500 text-white';
      case 'shopping': return 'bg-pink-500 text-white';
      case 'nature': return 'bg-emerald-500 text-white';
      case 'culture': return 'bg-indigo-500 text-white';
      case 'leisure': return 'bg-sky-500 text-white';
      case 'wellness': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start">
        <div className="text-sm font-medium w-16 text-muted-foreground">
          {activity.time}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium">{activity.title}</h4>
            {activity.category && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor()}`}>
                {activity.category}
              </span>
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
            <p className="text-xs font-medium mt-1 text-primary">
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
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">
              Day {day.day_number} - {formatDate(day.date)}
            </h3>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{day.activities.length} activities</span>
              <span className="font-medium text-primary">{formatCurrency(totalCost)}</span>
            </div>
          </div>
          <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border">
          {day.activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryDayCard;