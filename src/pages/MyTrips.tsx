
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, Trip } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import TripCard from '../components/ui/trip-card';
import AppLayout from '../components/layout/AppLayout';
import { Map, RefreshCw } from 'lucide-react';

const MyTrips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchTrips(activeTab);
    }
  }, [user, activeTab]);
  
  const fetchTrips = async (status: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', status)
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching trips:', error);
      } else if (data) {
        setTrips(data as Trip[]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'ongoing' })
        .eq('id', tripId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTrips(trips.filter(trip => trip.id !== tripId));
      
      toast({
        title: 'Trip started!',
        description: 'Your trip has been moved to ongoing trips.',
      });
    } catch (error) {
      console.error('Error starting trip:', error);
      toast({
        title: 'Action failed',
        description: 'An error occurred while starting the trip.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCancelTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'cancelled' })
        .eq('id', tripId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTrips(trips.filter(trip => trip.id !== tripId));
      
      toast({
        title: 'Trip cancelled',
        description: 'Your trip has been cancelled.',
      });
    } catch (error) {
      console.error('Error cancelling trip:', error);
      toast({
        title: 'Action failed',
        description: 'An error occurred while cancelling the trip.',
        variant: 'destructive',
      });
    }
  };
  
  const handleEditTrip = (tripId: string) => {
    // In a real app, this would navigate to an edit page
    toast({
      title: 'Edit feature',
      description: 'Trip editing would open here.',
    });
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Map size={24} className="text-primary" />
            <h1 className="text-2xl font-bold">My Trips</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => fetchTrips(activeTab)} 
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming trips</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>
                  Plan a Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onStart={() => handleStartTrip(trip.id)}
                    onEdit={() => handleEditTrip(trip.id)}
                    onCancel={() => handleCancelTrip(trip.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ongoing">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No ongoing trips</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onEdit={() => handleEditTrip(trip.id)}
                    showProgress
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed trips</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
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