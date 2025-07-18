
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import {
  Plane,
  Building,
  Train,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Check,
  Loader2
} from 'lucide-react';

type BookingType = 'flight' | 'hotel' | 'train';

interface BookingDetails {
  type: BookingType;
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: number;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  trainFrom?: string;
  trainTo?: string;
  trainDate?: string;
  trainClass?: string;
}

const Book: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<BookingType>('flight');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    type: 'flight',
  });
  
  // Flight form state
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  
  // Hotel form state
  const [hotelName, setHotelName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  
  // Train form state
  const [trainFrom, setTrainFrom] = useState('');
  const [trainTo, setTrainTo] = useState('');
  const [trainDate, setTrainDate] = useState('');
  const [trainClass, setTrainClass] = useState('Economy');
  
  useEffect(() => {
    // If tripId is provided, fetch trip details to pre-fill the form
    if (tripId) {
      const fetchTripDetails = async () => {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', tripId)
          .single();
        
        if (error) {
          console.error('Error fetching trip:', error);
        } else if (data) {
          // Pre-fill destination
          setFlightTo(data.destination);
          setTrainTo(data.destination);
          setHotelName(`Hotel in ${data.destination}`);
          
          // Pre-fill dates
          setDepartDate(data.start_date);
          setReturnDate(data.end_date);
          setCheckIn(data.start_date);
          setCheckOut(data.end_date);
          setTrainDate(data.start_date);
        }
      };
      
      fetchTripDetails();
    }
  }, [tripId]);
  
  const handleBookFlight = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingDetails({
        type: 'flight',
        from: flightFrom,
        to: flightTo,
        departDate,
        returnDate,
        passengers,
      });
      
      setShowConfirmation(true);
      setLoading(false);
    }, 1500);
  };
  
  const handleBookHotel = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingDetails({
        type: 'hotel',
        hotelName,
        checkIn,
        checkOut,
        rooms,
      });
      
      setShowConfirmation(true);
      setLoading(false);
    }, 1500);
  };
  
  const handleBookTrain = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingDetails({
        type: 'train',
        trainFrom,
        trainTo,
        trainDate,
        trainClass,
      });
      
      setShowConfirmation(true);
      setLoading(false);
    }, 1500);
  };
  
  const handleConfirmBooking = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to save your booking.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Save booking to database
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          trip_id: tripId || null,
          type: bookingDetails.type,
          details: bookingDetails,
          status: 'confirmed',
          confirmation_code: `BK${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        });
      
      if (error) {
        console.error('Error saving booking:', error);
        toast({
          title: 'Booking error',
          description: 'There was an error saving your booking.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Booking confirmed!',
          description: 'Your booking has been successfully confirmed.',
        });
        
        // Reset form
        setFlightFrom('');
        setFlightTo('');
        setDepartDate('');
        setReturnDate('');
        setPassengers(1);
        setHotelName('');
        setCheckIn('');
        setCheckOut('');
        setRooms(1);
        setTrainFrom('');
        setTrainTo('');
        setTrainDate('');
        setTrainClass('Economy');
        
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Error in booking process:', error);
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };
  
  const renderConfirmation = () => {
    let details;
    
    switch (bookingDetails.type) {
      case 'flight':
        details = (
          <>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{bookingDetails.from}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{bookingDetails.to}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Depart</span>
              <span className="font-medium">{bookingDetails.departDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Return</span>
              <span className="font-medium">{bookingDetails.returnDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Passengers</span>
              <span className="font-medium">{bookingDetails.passengers}</span>
            </div>
          </>
        );
        break;
      case 'hotel':
        details = (
          <>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Hotel</span>
              <span className="font-medium">{bookingDetails.hotelName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{bookingDetails.checkIn}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{bookingDetails.checkOut}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Rooms</span>
              <span className="font-medium">{bookingDetails.rooms}</span>
            </div>
          </>
        );
        break;
      case 'train':
        details = (
          <>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{bookingDetails.trainFrom}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{bookingDetails.trainTo}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{bookingDetails.trainDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Class</span>
              <span className="font-medium">{bookingDetails.trainClass}</span>
            </div>
          </>
        );
        break;
    }
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            Booking Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                {bookingDetails.type === 'flight' && <Plane className="h-4 w-4 mr-2" />}
                {bookingDetails.type === 'hotel' && <Building className="h-4 w-4 mr-2" />}
                {bookingDetails.type === 'train' && <Train className="h-4 w-4 mr-2" />}
                {bookingDetails.type.charAt(0).toUpperCase() + bookingDetails.type.slice(1)} Details
              </h3>
              {details}
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">Payment Information</h3>
              <p className="text-sm text-muted-foreground">
                This is a demo booking. No payment will be processed.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleConfirmBooking} className="w-full">
            Confirm Booking
          </Button>
          <Button variant="outline" onClick={() => setShowConfirmation(false)} className="w-full">
            Edit Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  if (showConfirmation) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto p-4 pb-20">
          <h1 className="text-2xl font-bold mb-6">Book</h1>
          {renderConfirmation()}
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Book</h1>
        
        <Tabs defaultValue="flight" value={activeTab} onValueChange={(value) => setActiveTab(value as BookingType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flight" className="flex items-center">
              <Plane className="h-4 w-4 mr-2" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotel" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center">
              <Train className="h-4 w-4 mr-2" />
              Trains
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="flight">
            <Card>
              <CardHeader>
                <CardTitle>Book a Flight</CardTitle>
              </CardHeader>
              <form onSubmit={handleBookFlight}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flight-from">From</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="flight-from"
                          placeholder="City or Airport"
                          className="pl-10"
                          value={flightFrom}
                          onChange={(e) => setFlightFrom(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flight-to">To</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="flight-to"
                          placeholder="City or Airport"
                          className="pl-10"
                          value={flightTo}
                          onChange={(e) => setFlightTo(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depart-date">Depart</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="depart-date"
                          type="date"
                          className="pl-10"
                          value={departDate}
                          onChange={(e) => setDepartDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="return-date">Return</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="return-date"
                          type="date"
                          className="pl-10"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="passengers"
                        type="number"
                        min="1"
                        max="10"
                        className="pl-10"
                        value={passengers}
                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Estimated Price</p>
                      <p className="text-2xl font-bold">$499</p>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Book Flight
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="hotel">
            <Card>
              <CardHeader>
                <CardTitle>Book a Hotel</CardTitle>
              </CardHeader>
              <form onSubmit={handleBookHotel}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-name">Hotel Name or Location</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="hotel-name"
                        placeholder="Hotel name or city"
                        className="pl-10"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="check-in">Check-in</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="check-in"
                          type="date"
                          className="pl-10"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="check-out">Check-out</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="check-out"
                          type="date"
                          className="pl-10"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="rooms"
                        type="number"
                        min="1"
                        max="5"
                        className="pl-10"
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Estimated Price</p>
                      <p className="text-2xl font-bold">$199/night</p>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Book Hotel
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="train">
            <Card>
              <CardHeader>
                <CardTitle>Book a Train</CardTitle>
              </CardHeader>
              <form onSubmit={handleBookTrain}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="train-from">From</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="train-from"
                          placeholder="City or Station"
                          className="pl-10"
                          value={trainFrom}
                          onChange={(e) => setTrainFrom(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="train-to">To</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="train-to"
                          placeholder="City or Station"
                          className="pl-10"
                          value={trainTo}
                          onChange={(e) => setTrainTo(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="train-date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="train-date"
                          type="date"
                          className="pl-10"
                          value={trainDate}
                          onChange={(e) => setTrainDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="train-class">Class</Label>
                      <select
                        id="train-class"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={trainClass}
                        onChange={(e) => setTrainClass(e.target.value)}
                        required
                      >
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Estimated Price</p>
                      <p className="text-2xl font-bold">$79</p>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Book Train
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Book;