
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  progress?: number;
  daysLeft?: number;
  className?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onStart?: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  id,
  title,
  destination,
  startDate,
  endDate,
  budget,
  status,
  progress = 0,
  daysLeft,
  className,
  onView,
  onEdit,
  onCancel,
  onStart,
}) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{destination}</span>
          </div>
        </div>
        <Badge className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="flex items-center text-sm mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        </div>
        {budget && (
          <div className="flex items-center text-sm mb-2">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Budget: ${budget.toLocaleString()}</span>
          </div>
        )}
        {status === 'ongoing' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {daysLeft !== undefined && (
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {daysLeft} days left
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex gap-2 flex-wrap">
        <Button size="sm" variant="default" onClick={() => onView?.(id)}>
          View
        </Button>
        {status === 'upcoming' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit?.(id)}>
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onStart?.(id)}>
              Start Trip
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onCancel?.(id)}>
              Cancel
            </Button>
          </>
        )}
        {status === 'ongoing' && (
          <Button size="sm" variant="outline" onClick={() => onEdit?.(id)}>
            Update
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TripCard;