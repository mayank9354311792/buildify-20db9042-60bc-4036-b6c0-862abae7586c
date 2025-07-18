
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateItinerary, saveItinerary, ItineraryDay } from '@/lib/generate-itinerary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ItineraryDayCard from '@/components/ui/itinerary-day-card';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2, Sparkles } from 'lucide-react';

const BuildBuddy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  
  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Generate itinerary
      const generatedItinerary = await generateItinerary({
        destination,
        startDate,
        endDate,
        interests: interests.split(',').map(i => i.trim()),
        budget: parseFloat(budget),
      });
      
      setItinerary(generatedItinerary);
      
      // Create trip in database if user is logged in
      if (user) {
        const { data, error } = await supabase
          .from('trips')
          .insert({
            user_id: user.id,
            title: `Trip to ${destination}`,
            destination,
            start_date: startDate,
            end_date: endDate,
            budget: parseFloat(budget),
            interests: interests.split(',').map(i => i.trim()),
            status: 'upcoming',
            is_public: false,
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating trip:', error);
        } else if (data) {
          setTripId(data.id);
          
          // Save itinerary days
          await saveItinerary(data.id, generatedItinerary);
        }
      }
      
      toast({
        title: 'Itinerary generated!',
        description: 'Your AI-powered travel itinerary is ready.',
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Generation failed',
        description: 'An error occurred while generating your itinerary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCustomize = () => {
    // In a real app, this would open a customization interface
    toast({
      title: 'Customize feature',
      description: 'Itinerary customization would open here.',
    });
  };
  
  const handleCloneTrip = () => {
    // In a real app, this would clone the trip for the user
    toast({
      title: 'Clone feature',
      description: 'Trip cloning would happen here.',
    });
  };
  
  const handleBookNow = () => {
    if (tripId) {
      navigate('/book', { state: { tripId } });
    } else {
      navigate('/book');
    }
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Build Buddy
          </h1>
          <p className="text-muted-foreground">Your AI trip planner</p>
        </div>
        
        {!itinerary ? (
          <Card>
            <CardHeader>
              <CardTitle>Plan Your Trip</CardTitle>
              <CardDescription>
                Tell us about your dream vacation and we'll create a personalized itinerary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateItinerary} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="Paris, Tokyo, New York..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <Textarea
                    id="interests"
                    placeholder="Food, history, nature, shopping..."
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate interests with commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Itinerary'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Itinerary</h2>
              <Button variant="outline" size="sm" onClick={() => setItinerary(null)}>
                New Plan
              </Button>
            </div>
            
            <div className="space-y-4">
              {itinerary.map((day) => (
                <ItineraryDayCard key={day.day_number} day={day} />
              ))}
            </div>
            
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleCustomize}>
                Customize
              </Button>
              <Button variant="outline" onClick={handleCloneTrip}>
                Clone Trip
              </Button>
              <Button variant="secondary" onClick={handleBookNow}>
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BuildBuddy;