
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trip } from '../../lib/supabase';
import { formatDate, formatCurrency } from '../../lib/utils';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onEdit?: () => void;
  onCancel?: () => void;
  onStart?: () => void;
  showProgress?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onEdit, 
  onCancel, 
  onStart,
  showProgress = false
}) => {
  // Calculate trip duration in days
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  
  // Calculate progress for ongoing trips
  const calculateProgress = () => {
    if (trip.status !== 'ongoing') return 0;
    
    const today = new Date();
    const elapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const progress = Math.min(Math.max(0, (elapsed / durationDays) * 100), 100);
    
    return progress;
  };
  
  // Calculate days left for ongoing trips
  const calculateDaysLeft = () => {
    if (trip.status !== 'ongoing') return 0;
    
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return Math.max(0, daysLeft);
  };
  
  const progress = calculateProgress();
  const daysLeft = calculateDaysLeft();
  
  // Status badge color
  const getStatusColor = () => {
    switch (trip.status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{trip.title}</CardTitle>
          <Badge className={getStatusColor()}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm mb-2">
          <MapPin size={16} className="mr-1 text-primary" />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center text-sm mb-2">
          <Calendar size={16} className="mr-1 text-primary" />
          <span>
            {formatDate(trip.start_date)} - {formatDate(trip.end_date)} ({durationDays} days)
          </span>
        </div>
        <div className="flex items-center text-sm mb-2">
          <DollarSign size={16} className="mr-1 text-primary" />
          <span>{formatCurrency(trip.budget)}</span>
        </div>
        
        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {trip.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        )}
        
        {showProgress && trip.status === 'ongoing' && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.round(progress)}% complete</span>
              <span>{daysLeft} days left</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {trip.status === 'upcoming' && (
          <>
            {onStart && (
              <Button size="sm" onClick={onStart}>Start Trip</Button>
            )}
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
            )}
            {onCancel && (
              <Button size="sm" variant="destructive" onClick={onCancel}>Cancel</Button>
            )}
          </>
        )}
        {trip.status === 'ongoing' && onEdit && (
          <Button size="sm" variant="outline" onClick={onEdit}>Update</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TripCard;