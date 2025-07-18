
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateItinerary, ItineraryDay, ItineraryParams } from '@/lib/generate-itinerary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import ItineraryDayCard from '@/components/ui/itinerary-day-card';
import { Sparkles, Calendar, MapPin, Bookmark, Plane, Loader2 } from 'lucide-react';

const BuildBuddy: React.FC = () => {
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
      // Validate inputs
      if (!destination || !startDate || !endDate || !budget) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      // Parse interests into array
      const interestsArray = interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);
      
      // Generate itinerary
      const params: ItineraryParams = {
        destination,
        startDate,
        endDate,
        interests: interestsArray,
        budget: parseFloat(budget),
      };
      
      const generatedItinerary = await generateItinerary(params);
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
            interests: interestsArray,
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
          for (const day of generatedItinerary) {
            await supabase
              .from('itinerary_days')
              .insert({
                trip_id: data.id,
                day_number: day.day_number,
                date: day.date,
                activities: day.activities,
              });
          }
        }
      }
      
      toast({
        title: 'Itinerary generated!',
        description: 'Your AI travel buddy has created your perfect trip.',
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Generation failed',
        description: 'There was an error generating your itinerary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCustomize = () => {
    // In a real app, this would open a customization interface
    toast({
      title: 'Customize itinerary',
      description: 'Customization feature coming soon!',
    });
  };
  
  const handleCloneTrip = () => {
    // In a real app, this would clone the trip for the user
    toast({
      title: 'Clone trip',
      description: 'Trip cloning feature coming soon!',
    });
  };
  
  const handleBookNow = () => {
    if (tripId) {
      navigate(`/book?tripId=${tripId}`);
    } else {
      navigate('/book');
    }
  };
  
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Build Buddy</h1>
          <div className="flex items-center text-primary">
            <Sparkles className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">AI Trip Planner</span>
          </div>
        </div>
        
        {!itinerary ? (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleGenerateItinerary} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Where do you want to go?</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="destination"
                      placeholder="Paris, Tokyo, New York..."
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="start-date"
                        type="date"
                        className="pl-10"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="end-date"
                        type="date"
                        className="pl-10"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">What are your interests?</Label>
                  <Textarea
                    id="interests"
                    placeholder="History, food, nature, shopping, art, adventure... (comma separated)"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">What's your budget? ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating your perfect trip...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Itinerary
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Your Trip to {destination}</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{destination}</span>
                </div>
                {interests && (
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{interests}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCustomize}>
                Customize
              </Button>
              <Button variant="outline" onClick={handleCloneTrip}>
                Clone Trip
              </Button>
              <Button variant="default" className="ml-auto" onClick={handleBookNow}>
                <Plane className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {itinerary.map((day) => (
                <ItineraryDayCard
                  key={day.day_number}
                  dayNumber={day.day_number}
                  date={day.date}
                  activities={day.activities}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BuildBuddy;