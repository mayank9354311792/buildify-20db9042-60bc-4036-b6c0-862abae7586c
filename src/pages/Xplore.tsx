
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SocialPostCard from '@/components/ui/social-post-card';
import { Search, RefreshCw, Loader2 } from 'lucide-react';

interface SocialPost {
  id: string;
  user_id: string;
  trip_id: string;
  content: string;
  image_urls: string[];
  likes_count: number;
  created_at: string;
  username: string;
  avatar_url: string | null;
  destination: string;
  isLiked?: boolean;
}

const Xplore: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be a proper join query
      // For this MVP, we'll simulate the data
      
      // Fetch some mock posts
      const mockPosts: SocialPost[] = [
        {
          id: '1',
          user_id: 'user1',
          trip_id: 'trip1',
          content: 'Just spent an amazing week exploring the streets of Paris! The Eiffel Tower at sunset is truly magical. #Paris #Travel',
          image_urls: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes_count: 124,
          created_at: new Date().toISOString(),
          username: 'traveler123',
          avatar_url: null,
          destination: 'Paris, France',
          isLiked: false,
        },
        {
          id: '2',
          user_id: 'user2',
          trip_id: 'trip2',
          content: 'Hiking through the mountains of Switzerland was breathtaking! The views are worth every step. #Switzerland #Hiking',
          image_urls: ['https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes_count: 87,
          created_at: new Date().toISOString(),
          username: 'mountainlover',
          avatar_url: null,
          destination: 'Swiss Alps, Switzerland',
          isLiked: true,
        },
        {
          id: '3',
          user_id: 'user3',
          trip_id: 'trip3',
          content: 'Beach vibes in Bali! The perfect place to relax and recharge. #Bali #BeachLife',
          image_urls: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes_count: 215,
          created_at: new Date().toISOString(),
          username: 'beachlover',
          avatar_url: null,
          destination: 'Bali, Indonesia',
          isLiked: false,
        },
        {
          id: '4',
          user_id: 'user4',
          trip_id: 'trip4',
          content: 'Exploring the ancient ruins of Rome. So much history in one place! #Rome #History',
          image_urls: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes_count: 156,
          created_at: new Date().toISOString(),
          username: 'historybuff',
          avatar_url: null,
          destination: 'Rome, Italy',
          isLiked: false,
        },
        {
          id: '5',
          user_id: 'user5',
          trip_id: 'trip5',
          content: 'The food in Tokyo is incredible! Trying all the local specialties. #Tokyo #FoodTour',
          image_urls: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes_count: 189,
          created_at: new Date().toISOString(),
          username: 'foodie_traveler',
          avatar_url: null,
          destination: 'Tokyo, Japan',
          isLiked: true,
        },
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const handleLike = (postId: string) => {
    // Update local state
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1,
          isLiked,
        };
      }
      return post;
    }));
    
    // In a real app, we would update the database
    toast({
      title: 'Success',
      description: 'Post liked!',
    });
  };
  
  const handleCloneTrip = (postId: string) => {
    // In a real app, this would clone the trip for the user
    toast({
      title: 'Trip cloned',
      description: 'This trip has been added to your trips.',
    });
  };
  
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;
  
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Xplore</h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search destinations, users, or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found. Try a different search.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <SocialPostCard
                key={post.id}
                id={post.id}
                username={post.username}
                avatarUrl={post.avatar_url || undefined}
                destination={post.destination}
                content={post.content}
                imageUrls={post.image_urls}
                likesCount={post.likes_count}
                isLiked={post.isLiked}
                isCreator={post.user_id === 'user5'} // Just for demo
                earnings={post.user_id === 'user5' ? 125.50 : undefined} // Just for demo
                onLike={handleLike}
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