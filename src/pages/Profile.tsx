
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import BadgeCard from '@/components/ui/badge-card';
import { 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Award, 
  MapPin, 
  Bookmark,
  Globe,
  Shield,
  Bell,
  HelpCircle
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hostMode, setHostMode] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/onboarding');
  };
  
  const handleToggleHostMode = (checked: boolean) => {
    setHostMode(checked);
    toast({
      title: checked ? 'Host mode activated' : 'Host mode deactivated',
      description: checked 
        ? 'You can now create and share trips with other travelers.' 
        : 'You are now in regular traveler mode.',
    });
  };
  
  // Mock badges data
  const badges = [
    { name: 'Globetrotter', description: 'Visited 10+ countries', imageUrl: '' },
    { name: 'Mountain Explorer', description: 'Completed 5 mountain hikes', imageUrl: '' },
    { name: 'Beach Lover', description: 'Visited 5 beach destinations', imageUrl: '' },
    { name: 'City Slicker', description: 'Explored 15 major cities', imageUrl: '' },
    { name: 'Cultural Connoisseur', description: 'Visited 10 museums', imageUrl: '' },
    { name: 'Foodie', description: 'Tried cuisine in 8 countries', imageUrl: '' },
    { name: 'Adventure Seeker', description: 'Completed 3 adventure activities', imageUrl: '' },
    { name: 'Night Owl', description: 'Experienced nightlife in 5 cities', imageUrl: '' },
    { name: 'Road Tripper', description: 'Completed a 1000+ mile road trip', imageUrl: '', locked: true },
    { name: 'Island Hopper', description: 'Visited 3 different islands', imageUrl: '', locked: true },
    { name: 'Winter Wanderer', description: 'Traveled to 3 snowy destinations', imageUrl: '', locked: true },
    { name: 'Luxury Traveler', description: 'Stayed at 5 luxury accommodations', imageUrl: '', locked: true },
  ];
  
  // Mock wish destinations
  const wishDestinations = [
    { id: '1', name: 'Bora Bora', lat: -16.5004, lng: -151.7415 },
    { id: '2', name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
    { id: '3', name: 'Santorini', lat: 36.3932, lng: 25.4615 },
    { id: '4', name: 'Machu Picchu', lat: -13.1631, lng: -72.5450 },
    { id: '5', name: 'Iceland', lat: 64.9631, lng: -19.0208 },
  ];
  
  // Mock saved trips
  const savedTrips = [
    { id: '1', title: 'Dream European Tour', description: '14 days across 5 countries' },
    { id: '2', title: 'Southeast Asia Adventure', description: 'Thailand, Vietnam, Cambodia' },
    { id: '3', title: 'African Safari', description: 'Wildlife spotting in Tanzania' },
  ];
  
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* User Info Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.username || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold">
                    {user?.user_metadata?.username || 'Guest User'}
                  </h2>
                  <p className="text-muted-foreground">
                    {user?.email || 'guest@example.com'}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="host-mode" 
                      checked={hostMode}
                      onCheckedChange={handleToggleHostMode}
                    />
                    <Label htmlFor="host-mode">Host Mode</Label>
                  </div>
                  {hostMode && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs Section */}
          <Tabs defaultValue="passport">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="passport" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Travel Passport
              </TabsTrigger>
              <TabsTrigger value="wishmap" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                WishMap
              </TabsTrigger>
              <TabsTrigger value="wishjar" className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" />
                WishJar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="passport" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Earned Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {badges.map((badge, index) => (
                      <BadgeCard
                        key={index}
                        name={badge.name}
                        description={badge.description}
                        imageUrl={badge.imageUrl}
                        locked={badge.locked}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishmap" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Dream Destinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                    <Globe className="h-12 w-12 text-muted-foreground opacity-50" />
                    <span className="ml-2 text-muted-foreground">Interactive map coming soon</span>
                  </div>
                  
                  <div className="space-y-2">
                    {wishDestinations.map((destination) => (
                      <div 
                        key={destination.id} 
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{destination.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Destination
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishjar" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bookmark className="h-5 w-5 mr-2 text-primary" />
                    Saved Trips & Travel Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedTrips.map((trip) => (
                      <div 
                        key={trip.id} 
                        className="p-4 border border-border rounded-md"
                      >
                        <h3 className="font-medium">{trip.title}</h3>
                        <p className="text-sm text-muted-foreground">{trip.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Plan Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Add New Goal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>Notifications</span>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Privacy Mode</span>
                </div>
                <Switch id="privacy" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Help & Support</span>
                </div>
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;