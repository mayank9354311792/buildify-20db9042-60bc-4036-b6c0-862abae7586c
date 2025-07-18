
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import TripCard from '@/components/ui/trip-card';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  progress?: number;
  daysLeft?: number;
}

const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      // If not logged in, use mock data
      setTrips(getMockTrips());
      setLoading(false);
    }
  }, [user, activeTab]);
  
  const fetchTrips = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would fetch from the database
      // For this MVP, we'll use mock data
      setTrips(getMockTrips());
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trips. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getMockTrips = (): Trip[] => {
    // Generate mock trips based on the active tab
    const now = new Date();
    const mockTrips: Trip[] = [];
    
    if (activeTab === 'upcoming') {
      mockTrips.push({
        id: '1',
        title: 'Summer in Paris',
        destination: 'Paris, France',
        start_date: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth() + 1, 22).toISOString(),
        budget: 2500,
        status: 'upcoming',
      });
      mockTrips.push({
        id: '2',
        title: 'Tokyo Adventure',
        destination: 'Tokyo, Japan',
        start_date: new Date(now.getFullYear(), now.getMonth() + 3, 5).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth() + 3, 15).toISOString(),
        budget: 3500,
        status: 'upcoming',
      });
    } else if (activeTab === 'ongoing') {
      mockTrips.push({
        id: '3',
        title: 'Italian Getaway',
        destination: 'Rome, Italy',
        start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5).toISOString(),
        budget: 2000,
        status: 'ongoing',
        progress: 30,
        daysLeft: 5,
      });
    } else if (activeTab === 'completed') {
      mockTrips.push({
        id: '4',
        title: 'Barcelona Weekend',
        destination: 'Barcelona, Spain',
        start_date: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth() - 1, 13).toISOString(),
        budget: 1200,
        status: 'completed',
      });
      mockTrips.push({
        id: '5',
        title: 'New York City Trip',
        destination: 'New York, USA',
        start_date: new Date(now.getFullYear(), now.getMonth() - 2, 20).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth() - 2, 27).toISOString(),
        budget: 3000,
        status: 'completed',
      });
      mockTrips.push({
        id: '6',
        title: 'Beach Vacation',
        destination: 'Cancun, Mexico',
        start_date: new Date(now.getFullYear(), now.getMonth() - 3, 5).toISOString(),
        end_date: new Date(now.getFullYear(), now.getMonth() - 3, 12).toISOString(),
        budget: 2200,
        status: 'completed',
      });
    }
    
    return mockTrips;
  };
  
  const handleViewTrip = (tripId: string) => {
    // In a real app, this would navigate to a trip details page
    toast({
      title: 'View Trip',
      description: `Viewing trip ${tripId}`,
    });
  };
  
  const handleEditTrip = (tripId: string) => {
    // In a real app, this would navigate to a trip edit page
    toast({
      title: 'Edit Trip',
      description: `Editing trip ${tripId}`,
    });
  };
  
  const handleCancelTrip = (tripId: string) => {
    // In a real app, this would update the trip status in the database
    toast({
      title: 'Trip Cancelled',
      description: 'Your trip has been cancelled.',
    });
    
    // Update local state
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'cancelled' as const } : trip
    ));
  };
  
  const handleStartTrip = (tripId: string) => {
    // In a real app, this would update the trip status in the database
    toast({
      title: 'Trip Started',
      description: 'Your trip has been marked as ongoing.',
    });
    
    // Update local state
    setTrips(trips.map(trip => 
      trip.id === tripId ? { 
        ...trip, 
        status: 'ongoing' as const,
        progress: 0,
        daysLeft: 7, // Example value
      } : trip
    ));
  };
  
  const handleCreateTrip = () => {
    navigate('/');
  };
  
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <Button onClick={handleCreateTrip}>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming trips. Plan your next adventure!</p>
                <Button onClick={handleCreateTrip} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    title={trip.title}
                    destination={trip.destination}
                    startDate={trip.start_date}
                    endDate={trip.end_date}
                    budget={trip.budget || undefined}
                    status={trip.status}
                    onView={handleViewTrip}
                    onEdit={handleEditTrip}
                    onCancel={handleCancelTrip}
                    onStart={handleStartTrip}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ongoing" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No ongoing trips.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    title={trip.title}
                    destination={trip.destination}
                    startDate={trip.start_date}
                    endDate={trip.end_date}
                    budget={trip.budget || undefined}
                    status={trip.status}
                    progress={trip.progress}
                    daysLeft={trip.daysLeft}
                    onView={handleViewTrip}
                    onEdit={handleEditTrip}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed trips yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    title={trip.title}
                    destination={trip.destination}
                    startDate={trip.start_date}
                    endDate={trip.end_date}
                    budget={trip.budget || undefined}
                    status={trip.status}
                    onView={handleViewTrip}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyTrips;