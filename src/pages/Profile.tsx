
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase, Badge, WishDestination } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import BadgeCard from '@/components/ui/badge-card';
import AppLayout from '@/components/layout/AppLayout';
import { User, LogOut, Map, Sun, Moon, Computer, Award, MapPin, Heart } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [wishDestinations, setWishDestinations] = useState<WishDestination[]>([]);
  const [hostMode, setHostMode] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchBadges();
      fetchWishDestinations();
    }
  }, [user]);
  
  const fetchBadges = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching badges:', error);
      } else if (data) {
        setBadges(data as Badge[]);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };
  
  const fetchWishDestinations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wish_destinations')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching wish destinations:', error);
      } else if (data) {
        setWishDestinations(data as WishDestination[]);
      }
    } catch (error) {
      console.error('Error fetching wish destinations:', error);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/onboarding');
  };
  
  const handleHostModeToggle = (checked: boolean) => {
    setHostMode(checked);
    
    toast({
      title: checked ? 'Host mode activated' : 'Host mode deactivated',
      description: checked 
        ? 'You can now create and share travel experiences.' 
        : 'You are now in traveler mode.',
    });
  };
  
  // Mock badges if none exist
  const getMockBadges = (): Badge[] => {
    if (badges.length > 0) return badges;
    
    return [
      {
        id: '1',
        user_id: user?.id || '',
        badge_name: 'Explorer',
        badge_description: 'Visited 5 different countries',
        badge_image_url: '',
        earned_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: user?.id || '',
        badge_name: 'Adventurer',
        badge_description: 'Completed an adventure activity',
        badge_image_url: '',
        earned_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: user?.id || '',
        badge_name: 'Foodie',
        badge_description: 'Tried 10 local cuisines',
        badge_image_url: '',
        earned_at: new Date().toISOString(),
      },
    ];
  };
  
  // Mock wish destinations if none exist
  const getMockWishDestinations = (): WishDestination[] => {
    if (wishDestinations.length > 0) return wishDestinations;
    
    return [
      {
        id: '1',
        user_id: user?.id || '',
        destination: 'Bali, Indonesia',
        notes: 'Beach vacation',
        latitude: -8.4095,
        longitude: 115.1889,
      },
      {
        id: '2',
        user_id: user?.id || '',
        destination: 'Kyoto, Japan',
        notes: 'Cherry blossom season',
        latitude: 35.0116,
        longitude: 135.7681,
      },
      {
        id: '3',
        user_id: user?.id || '',
        destination: 'Santorini, Greece',
        notes: 'Summer getaway',
        latitude: 36.3932,
        longitude: 25.4615,
      },
    ];
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User size={24} className="text-primary" />
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut size={16} />
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user?.username || 'Guest'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not signed in'}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="host-mode">Host Mode</Label>
                <Switch
                  id="host-mode"
                  checked={hostMode}
                  onCheckedChange={handleHostModeToggle}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {hostMode ? 'Active' : 'Inactive'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="passport">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="passport" className="flex items-center gap-1">
              <Award size={16} />
              <span>Passport</span>
            </TabsTrigger>
            <TabsTrigger value="wishmap" className="flex items-center gap-1">
              <Map size={16} />
              <span>WishMap</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="passport" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  Travel Passport
                </CardTitle>
                <CardDescription>
                  Badges and achievements from your travels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {getMockBadges().map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishmap" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  WishMap
                </CardTitle>
                <CardDescription>
                  Places you want to visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-4 mb-4 text-center">
                  <Map size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Map view coming soon
                  </p>
                </div>
                
                <h3 className="font-medium mb-2 flex items-center gap-1">
                  <Heart size={16} className="text-primary" />
                  WishJar
                </h3>
                <div className="space-y-2">
                  {getMockWishDestinations().map((destination) => (
                    <div 
                      key={destination.id} 
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{destination.destination}</div>
                        <div className="text-xs text-muted-foreground">
                          {destination.notes}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MapPin size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your app preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Theme</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun size={16} />
                        <Label htmlFor="light-theme">Light</Label>
                      </div>
                      <Switch
                        id="light-theme"
                        checked={theme === 'light'}
                        onCheckedChange={() => setTheme('light')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon size={16} />
                        <Label htmlFor="dark-theme">Dark</Label>
                      </div>
                      <Switch
                        id="dark-theme"
                        checked={theme === 'dark'}
                        onCheckedChange={() => setTheme('dark')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Computer size={16} />
                        <Label htmlFor="system-theme">System</Label>
                      </div>
                      <Switch
                        id="system-theme"
                        checked={theme === 'system'}
                        onCheckedChange={() => setTheme('system')}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <Switch id="public-profile" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;