
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, SocialPost } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SocialPostCard from '@/components/ui/social-post-card';
import AppLayout from '@/components/layout/AppLayout';
import { Compass, RefreshCw } from 'lucide-react';

const Xplore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          user:users(*),
          trip:trips(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching posts:', error);
      } else if (data) {
        setPosts(data as SocialPost[]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloneTrip = async (tripId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to clone this trip.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Get the original trip
      const { data: originalTrip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();
      
      if (tripError || !originalTrip) {
        throw new Error('Failed to fetch original trip');
      }
      
      // Clone the trip for the current user
      const { data: newTrip, error: cloneError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: `${originalTrip.title} (Cloned)`,
          destination: originalTrip.destination,
          start_date: originalTrip.start_date,
          end_date: originalTrip.end_date,
          budget: originalTrip.budget,
          interests: originalTrip.interests,
          status: 'upcoming',
          is_public: false,
        })
        .select()
        .single();
      
      if (cloneError || !newTrip) {
        throw new Error('Failed to clone trip');
      }
      
      // Get the original itinerary
      const { data: originalItinerary, error: itineraryError } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('trip_id', tripId);
      
      if (itineraryError || !originalItinerary) {
        throw new Error('Failed to fetch original itinerary');
      }
      
      // Clone the itinerary for the new trip
      for (const day of originalItinerary) {
        await supabase
          .from('itinerary_days')
          .insert({
            trip_id: newTrip.id,
            day_number: day.day_number,
            date: day.date,
            activities: day.activities,
          });
      }
      
      toast({
        title: 'Trip cloned!',
        description: 'The trip has been added to your trips.',
      });
    } catch (error) {
      console.error('Error cloning trip:', error);
      toast({
        title: 'Clone failed',
        description: 'An error occurred while cloning the trip.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Compass size={24} className="text-primary" />
            <h1 className="text-2xl font-bold">Xplore</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchPosts} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw size={24} className="animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No posts to display</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <SocialPostCard
                key={post.id}
                post={post}
                onCloneTrip={handleCloneTrip}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Xplore;