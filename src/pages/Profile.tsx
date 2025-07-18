
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  fetchTravelBadges, 
  fetchWishDestinations,
  addWishDestination,
  removeWishDestination,
  TravelBadge,
  WishDestination
} from '../lib/supabase';
import { 
  User, 
  LogOut, 
  Map, 
  Award, 
  Settings, 
  Sun, 
  Moon, 
  Laptop, 
  MapPin, 
  Heart, 
  Plus, 
  Trash2
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import BadgeCard from '../components/ui/badge-card';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'passport' | 'wishmap' | 'settings'>('passport');
  const [isHost, setIsHost] = useState(false);
  const [badges, setBadges] = useState<TravelBadge[]>([]);
  const [wishDestinations, setWishDestinations] = useState<WishDestination[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const [newDestinationNote, setNewDestinationNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);
  
  const loadUserData = async () => {
    setLoading(true);
    try {
      // Fetch user profile to get host status
      const profile = await fetchUserProfile(user!.id);
      setIsHost(profile.is_host);
      
      // Fetch badges
      const badgesData = await fetchTravelBadges(user!.id);
      setBadges(badgesData);
      
      // Fetch wish destinations
      const wishData = await fetchWishDestinations(user!.id);
      setWishDestinations(wishData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/onboarding');
  };
  
  const toggleHostMode = async () => {
    try {
      await updateUserProfile(user!.id, { is_host: !isHost });
      setIsHost(!isHost);
    } catch (error) {
      console.error('Error toggling host mode:', error);
    }
  };
  
  const handleAddWishDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination) return;
    
    try {
      const newWish = await addWishDestination({
        user_id: user!.id,
        destination: newDestination,
        notes: newDestinationNote || undefined
      });
      
      setWishDestinations([newWish, ...wishDestinations]);
      setNewDestination('');
      setNewDestinationNote('');
    } catch (error) {
      console.error('Error adding wish destination:', error);
    }
  };
  
  const handleRemoveWishDestination = async (id: string) => {
    try {
      await removeWishDestination(id);
      setWishDestinations(wishDestinations.filter(wish => wish.id !== id));
    } catch (error) {
      console.error('Error removing wish destination:', error);
    }
  };
  
  // If no badges, show placeholder badges
  const getBadges = () => {
    if (badges.length > 0) return badges;
    
    return [
      {
        id: 'placeholder-1',
        user_id: user?.id || '',
        badge_name: 'First Trip',
        badge_description: 'Complete your first trip to earn this badge',
        badge_image_url: '',
        earned_at: new Date().toISOString()
      },
      {
        id: 'placeholder-2',
        user_id: user?.id || '',
        badge_name: 'Explorer',
        badge_description: 'Visit 3 different destinations',
        badge_image_url: '',
        earned_at: new Date().toISOString()
      },
      {
        id: 'placeholder-3',
        user_id: user?.id || '',
        badge_name: 'Adventurer',
        badge_description: 'Try an adventure activity during your trip',
        badge_image_url: '',
        earned_at: new Date().toISOString()
      }
    ];
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile
          </h1>
        </div>
        
        {/* User Profile Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.email?.split('@')[0] || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Host Mode</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isHost ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
                onClick={toggleHostMode}
              >
                <div className="h-4 w-4 rounded-full bg-white"></div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {isHost ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'passport' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('passport')}
            >
              <div className="flex items-center justify-center gap-1">
                <Award className="h-4 w-4" />
                <span>Passport</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'wishmap' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('wishmap')}
            >
              <div className="flex items-center justify-center gap-1">
                <Map className="h-4 w-4" />
                <span>WishMap</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="flex items-center justify-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-6">
          {/* Travel Passport */}
          {activeTab === 'passport' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Travel Passport
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {getBadges().map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}
          
          {/* WishMap */}
          {activeTab === 'wishmap' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                WishMap
              </h3>
              
              <div className="bg-muted/30 rounded-lg p-4 mb-4 text-center">
                <Map className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Interactive map coming soon
                </p>
              </div>
              
              <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                WishJar
              </h4>
              
              <form onSubmit={handleAddWishDestination} className="mb-4">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add destination..."
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-md bg-primary text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={newDestinationNote}
                  onChange={(e) => setNewDestinationNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
              </form>
              
              <div className="space-y-3">
                {wishDestinations.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Add your dream destinations to your WishJar
                  </div>
                ) : (
                  wishDestinations.map(wish => (
                    <div 
                      key={wish.id} 
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                    >
                      <div>
                        <div className="font-medium text-sm">{wish.destination}</div>
                        {wish.notes && (
                          <div className="text-xs text-muted-foreground">{wish.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveWishDestination(wish.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Settings */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Settings
              </h3>
              
              <div className="space-y-6">
                {/* Theme Settings */}
                <div>
                  <h4 className="text-md font-medium mb-3">Theme</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span className="text-sm">Light</span>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${theme === 'light' ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
                        onClick={() => setTheme('light')}
                      >
                        {theme === 'light' && <div className="h-4 w-4 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span className="text-sm">Dark</span>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
                        onClick={() => setTheme('dark')}
                      >
                        {theme === 'dark' && <div className="h-4 w-4 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        <span className="text-sm">System</span>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${theme === 'system' ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
                        onClick={() => setTheme('system')}
                      >
                        {theme === 'system' && <div className="h-4 w-4 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notifications */}
                <div>
                  <h4 className="text-md font-medium mb-3">Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <div className="w-12 h-6 rounded-full bg-primary flex items-center p-1 justify-end cursor-pointer">
                        <div className="h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <div className="w-12 h-6 rounded-full bg-primary flex items-center p-1 justify-end cursor-pointer">
                        <div className="h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Privacy */}
                <div>
                  <h4 className="text-md font-medium mb-3">Privacy</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public Profile</span>
                      <div className="w-12 h-6 rounded-full bg-muted flex items-center p-1 justify-start cursor-pointer">
                        <div className="h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Share Trip Activity</span>
                      <div className="w-12 h-6 rounded-full bg-primary flex items-center p-1 justify-end cursor-pointer">
                        <div className="h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account */}
                <div>
                  <h4 className="text-md font-medium mb-3">Account</h4>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-4 rounded-md bg-destructive/10 text-destructive flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;