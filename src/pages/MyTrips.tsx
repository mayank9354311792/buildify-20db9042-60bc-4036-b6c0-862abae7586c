
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import TripCard from '../components/ui/trip-card';
import AppLayout from '../components/layout/AppLayout';
import { fetchTrips, updateTrip, deleteTrip } from '../lib/supabase';
import { Trip } from '../lib/supabase';
import { Map, RefreshCw, Plus } from 'lucide-react';

const MyTrips = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchUserTrips(activeTab);
    }
  }, [user, activeTab]);
  
  const fetchUserTrips = async (status: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const fetchedTrips = await fetchTrips(user.id, status);
      setTrips(fetchedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartTrip = async (tripId: string) => {
    try {
      await updateTrip(tripId, { status: 'ongoing' });
      
      // Update local state
      setTrips(trips.filter(trip => trip.id !== tripId));
      
      alert('Trip started! It has been moved to ongoing trips.');
    } catch (error) {
      console.error('Error starting trip:', error);
      alert('Failed to start trip. Please try again.');
    }
  };
  
  const handleCancelTrip = async (tripId: string) => {
    try {
      await updateTrip(tripId, { status: 'cancelled' });
      
      // Update local state
      setTrips(trips.filter(trip => trip.id !== tripId));
      
      alert('Trip cancelled.');
    } catch (error) {
      console.error('Error cancelling trip:', error);
      alert('Failed to cancel trip. Please try again.');
    }
  };
  
  const handleEditTrip = (tripId: string) => {
    // In a real app, this would navigate to an edit page
    alert('Edit feature would open here');
  };
  
  const handleViewTrip = (tripId: string) => {
    // In a real app, this would navigate to a trip details page
    alert('View trip details would open here');
  };
  
  const handleShareTrip = (tripId: string) => {
    // In a real app, this would open a share dialog
    alert('Share trip feature would open here');
  };
  
  const handleCreateTrip = () => {
    // Navigate to the Build Buddy page
    window.location.href = '/';
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Map size={24} className="text-primary" />
            <h1 className="text-2xl font-bold">My Trips</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2" 
              onClick={() => fetchUserTrips(activeTab)} 
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleCreateTrip}
            >
              <Plus size={16} />
              New
            </Button>
          </div>
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
                <Button className="mt-4" onClick={handleCreateTrip}>
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
                    onView={() => handleViewTrip(trip.id)}
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
                    onView={() => handleViewTrip(trip.id)}
                    onShare={() => handleShareTrip(trip.id)}
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