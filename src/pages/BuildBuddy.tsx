
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import ItineraryDayCard from '../components/ui/itinerary-day-card';
import AppLayout from '../components/layout/AppLayout';
import { generateItinerary, saveItineraryToTrip } from '../lib/generate-itinerary';
import { createTrip } from '../lib/supabase';
import { ItineraryDay } from '../lib/supabase';
import { Sparkles, Loader2, Calendar, MapPin, DollarSign, Tags } from 'lucide-react';

const BuildBuddy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  
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
        budget: parseFloat(budget),
        tags: interests.split(',').map(i => i.trim())
      });
      
      setItinerary(generatedItinerary);
      
      // Create trip in database if user is logged in
      if (user) {
        const newTrip = await createTrip({
          user_id: user.id,
          title: `Trip to ${destination}`,
          source,
          destination,
          start_date: startDate,
          end_date: endDate,
          budget: parseFloat(budget),
          is_public: false,
          status: 'upcoming',
          tags: interests.split(',').map(i => i.trim())
        });
        
        setTripId(newTrip.id);
        
        // Save itinerary
        await saveItineraryToTrip(newTrip.id, generatedItinerary);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCustomize = () => {
    // In a real app, this would open a customization interface
    alert('Customize feature would open here');
  };
  
  const handleCloneTrip = () => {
    // In a real app, this would clone the trip for the user
    alert('Clone feature would happen here');
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
                  <Label htmlFor="source">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="source"
                      className="pl-9"
                      placeholder="Your location"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      className="pl-9"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="start-date"
                        className="pl-9"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="end-date"
                        className="pl-9"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      className="pl-9"
                      type="number"
                      placeholder="5000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <div className="relative">
                    <Tags className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="interests"
                      className="pl-9"
                      placeholder="Food, history, nature, shopping..."
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Separate interests with commas
                  </p>
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