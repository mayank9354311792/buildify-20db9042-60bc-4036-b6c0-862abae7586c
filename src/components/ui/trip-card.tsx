
import React from 'react';
import { Trip } from '../../lib/supabase';
import { formatDate, formatCurrency, calculateDays } from '../../lib/utils';
import { Calendar, MapPin, DollarSign, Tag } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onView?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onStart?: () => void;
  showProgress?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onView, 
  onEdit, 
  onCancel, 
  onStart,
  showProgress = false
}) => {
  // Calculate trip duration
  const durationDays = calculateDays(trip.start_date, trip.end_date);
  
  // Calculate progress for ongoing trips
  const calculateProgress = () => {
    if (trip.status !== 'ongoing') return 0;
    
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    const totalDays = calculateDays(trip.start_date, trip.end_date);
    const daysElapsed = calculateDays(trip.start_date, today.toISOString());
    
    return Math.min(Math.max(0, (daysElapsed / totalDays) * 100), 100);
  };
  
  // Calculate days left for ongoing trips
  const calculateDaysLeft = () => {
    if (trip.status !== 'ongoing') return 0;
    
    const today = new Date();
    const end = new Date(trip.end_date);
    
    const daysLeft = calculateDays(today.toISOString(), trip.end_date);
    return Math.max(0, daysLeft);
  };
  
  const progress = calculateProgress();
  const daysLeft = calculateDaysLeft();
  
  // Status badge color
  const getStatusColor = () => {
    switch (trip.status) {
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'ongoing': return 'bg-green-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{trip.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{trip.destination}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)} ({durationDays} days)
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            <span>{formatCurrency(trip.budget)}</span>
          </div>
        </div>
        
        {trip.tags && trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {trip.tags.map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
        )}
        
        {showProgress && trip.status === 'ongoing' && (
          <div className="mb-3">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.round(progress)}% complete</span>
              <span>{daysLeft} days left</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          {onView && (
            <button 
              onClick={onView}
              className="flex-1 py-2 rounded-md bg-primary text-white text-sm font-medium"
            >
              View
            </button>
          )}
          
          {trip.status === 'upcoming' && onStart && (
            <button 
              onClick={onStart}
              className="flex-1 py-2 rounded-md bg-green-500 text-white text-sm font-medium"
            >
              Start Trip
            </button>
          )}
          
          {onEdit && (
            <button 
              onClick={onEdit}
              className="flex-1 py-2 rounded-md bg-muted text-foreground text-sm font-medium"
            >
              Edit
            </button>
          )}
          
          {trip.status === 'upcoming' && onCancel && (
            <button 
              onClick={onCancel}
              className="flex-1 py-2 rounded-md bg-red-500 text-white text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;