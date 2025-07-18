
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Plane, Hotel, Train, Calendar, MapPin, CreditCard, Check } from 'lucide-react';

const Book = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get tripId from location state if available
  const tripId = location.state?.tripId;
  
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'trains'>('flights');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Flight booking form state
  const [flightOrigin, setFlightOrigin] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightDepartDate, setFlightDepartDate] = useState('');
  const [flightReturnDate, setFlightReturnDate] = useState('');
  const [flightPassengers, setFlightPassengers] = useState('1');
  
  // Hotel booking form state
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelGuests, setHotelGuests] = useState('1');
  const [hotelRooms, setHotelRooms] = useState('1');
  
  // Train booking form state
  const [trainOrigin, setTrainOrigin] = useState('');
  const [trainDestination, setTrainDestination] = useState('');
  const [trainDepartDate, setTrainDepartDate] = useState('');
  const [trainPassengers, setTrainPassengers] = useState('1');
  
  const handleBookFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (user) {
        // Save booking to database
        await supabase
          .from('bookings')
          .insert({
            trip_id: tripId,
            user_id: user.id,
            type: 'flight',
            details: {
              origin: flightOrigin,
              destination: flightDestination,
              departDate: flightDepartDate,
              returnDate: flightReturnDate,
              passengers: parseInt(flightPassengers),
            },
            confirmation_code: `FL${Math.floor(Math.random() * 10000)}`,
            status: 'confirmed',
          });
      }
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error booking flight:', error);
      toast({
        title: 'Booking failed',
        description: 'An error occurred while processing your booking.',
        variant: 'destructive',
      });
    }
  };
  
  const handleBookHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (user) {
        // Save booking to database
        await supabase
          .from('bookings')
          .insert({
            trip_id: tripId,
            user_id: user.id,
            type: 'hotel',
            details: {
              location: hotelLocation,
              checkIn: hotelCheckIn,
              checkOut: hotelCheckOut,
              guests: parseInt(hotelGuests),
              rooms: parseInt(hotelRooms),
            },
            confirmation_code: `HT${Math.floor(Math.random() * 10000)}`,
            status: 'confirmed',
          });
      }
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error booking hotel:', error);
      toast({
        title: 'Booking failed',
        description: 'An error occurred while processing your booking.',
        variant: 'destructive',
      });
    }
  };
  
  const handleBookTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (user) {
        // Save booking to database
        await supabase
          .from('bookings')
          .insert({
            trip_id: tripId,
            user_id: user.id,
            type: 'train',
            details: {
              origin: trainOrigin,
              destination: trainDestination,
              departDate: trainDepartDate,
              passengers: parseInt(trainPassengers),
            },
            confirmation_code: `TR${Math.floor(Math.random() * 10000)}`,
            status: 'confirmed',
          });
      }
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error booking train:', error);
      toast({
        title: 'Booking failed',
        description: 'An error occurred while processing your booking.',
        variant: 'destructive',
      });
    }
  };
  
  const handleNewBooking = () => {
    setShowConfirmation(false);
    
    // Reset form fields based on active tab
    if (activeTab === 'flights') {
      setFlightOrigin('');
      setFlightDestination('');
      setFlightDepartDate('');
      setFlightReturnDate('');
      setFlightPassengers('1');
    } else if (activeTab === 'hotels') {
      setHotelLocation('');
      setHotelCheckIn('');
      setHotelCheckOut('');
      setHotelGuests('1');
      setHotelRooms('1');
    } else if (activeTab === 'trains') {
      setTrainOrigin('');
      setTrainDestination('');
      setTrainDepartDate('');
      setTrainPassengers('1');
    }
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Book</h1>
          <p className="text-muted-foreground">Find and book your travel</p>
        </div>
        
        {!showConfirmation ? (
          <Card>
            <CardHeader>
              <CardTitle>Travel Booking</CardTitle>
              <CardDescription>
                Book flights, hotels, and trains for your trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="flights" className="flex items-center gap-1">
                    <Plane size={16} />
                    <span>Flights</span>
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="flex items-center gap-1">
                    <Hotel size={16} />
                    <span>Hotels</span>
                  </TabsTrigger>
                  <TabsTrigger value="trains" className="flex items-center gap-1">
                    <Train size={16} />
                    <span>Trains</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="flights">
                  <form onSubmit={handleBookFlight} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="flight-origin">Origin</Label>
                      <Input
                        id="flight-origin"
                        placeholder="City or airport"
                        value={flightOrigin}
                        onChange={(e) => setFlightOrigin(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flight-destination">Destination</Label>
                      <Input
                        id="flight-destination"
                        placeholder="City or airport"
                        value={flightDestination}
                        onChange={(e) => setFlightDestination(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flight-depart">Departure</Label>
                        <Input
                          id="flight-depart"
                          type="date"
                          value={flightDepartDate}
                          onChange={(e) => setFlightDepartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="flight-return">Return</Label>
                        <Input
                          id="flight-return"
                          type="date"
                          value={flightReturnDate}
                          onChange={(e) => setFlightReturnDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flight-passengers">Passengers</Label>
                      <Input
                        id="flight-passengers"
                        type="number"
                        min="1"
                        max="10"
                        value={flightPassengers}
                        onChange={(e) => setFlightPassengers(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Search Flights
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="hotels">
                  <form onSubmit={handleBookHotel} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotel-location">Destination</Label>
                      <Input
                        id="hotel-location"
                        placeholder="City or specific hotel"
                        value={hotelLocation}
                        onChange={(e) => setHotelLocation(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotel-checkin">Check-in</Label>
                        <Input
                          id="hotel-checkin"
                          type="date"
                          value={hotelCheckIn}
                          onChange={(e) => setHotelCheckIn(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hotel-checkout">Check-out</Label>
                        <Input
                          id="hotel-checkout"
                          type="date"
                          value={hotelCheckOut}
                          onChange={(e) => setHotelCheckOut(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotel-guests">Guests</Label>
                        <Input
                          id="hotel-guests"
                          type="number"
                          min="1"
                          max="10"
                          value={hotelGuests}
                          onChange={(e) => setHotelGuests(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hotel-rooms">Rooms</Label>
                        <Input
                          id="hotel-rooms"
                          type="number"
                          min="1"
                          max="5"
                          value={hotelRooms}
                          onChange={(e) => setHotelRooms(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Search Hotels
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="trains">
                  <form onSubmit={handleBookTrain} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="train-origin">Origin</Label>
                      <Input
                        id="train-origin"
                        placeholder="City or station"
                        value={trainOrigin}
                        onChange={(e) => setTrainOrigin(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="train-destination">Destination</Label>
                      <Input
                        id="train-destination"
                        placeholder="City or station"
                        value={trainDestination}
                        onChange={(e) => setTrainDestination(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="train-depart">Departure Date</Label>
                      <Input
                        id="train-depart"
                        type="date"
                        value={trainDepartDate}
                        onChange={(e) => setTrainDepartDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="train-passengers">Passengers</Label>
                      <Input
                        id="train-passengers"
                        type="number"
                        min="1"
                        max="10"
                        value={trainPassengers}
                        onChange={(e) => setTrainPassengers(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Search Trains
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Booking Confirmed!</CardTitle>
              <CardDescription>
                Your {activeTab === 'flights' ? 'flight' : activeTab === 'hotels' ? 'hotel' : 'train'} has been successfully booked
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                {activeTab === 'flights' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Plane size={16} className="text-primary" />
                      <span className="font-medium">Flight Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>From: {flightOrigin}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>To: {flightDestination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Depart: {flightDepartDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Return: {flightReturnDate}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'hotels' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Hotel size={16} className="text-primary" />
                      <span className="font-medium">Hotel Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>Location: {hotelLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Check-in: {hotelCheckIn}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Check-out: {hotelCheckOut}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'trains' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Train size={16} className="text-primary" />
                      <span className="font-medium">Train Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>From: {trainOrigin}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>To: {trainDestination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Depart: {trainDepartDate}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-1 text-sm">
                  <CreditCard size={14} className="text-muted-foreground" />
                  <span>Confirmation: {`${activeTab === 'flights' ? 'FL' : activeTab === 'hotels' ? 'HT' : 'TR'}${Math.floor(Math.random() * 10000)}`}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNewBooking} className="w-full">
                Make Another Booking
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Book;