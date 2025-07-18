
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import SocialPostCard from '../components/ui/social-post-card';
import AppLayout from '../components/layout/AppLayout';
import { fetchPosts, likePost, unlikePost, checkIfLiked, cloneTrip } from '../lib/supabase';
import { Post } from '../lib/supabase';
import { Compass, RefreshCw, Filter, Search } from 'lucide-react';

const Xplore = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    fetchPostsData();
  }, []);
  
  const fetchPostsData = async () => {
    setLoading(true);
    
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      
      // Check which posts are liked by the current user
      if (user) {
        const likedStatus: Record<string, boolean> = {};
        
        for (const post of fetchedPosts) {
          likedStatus[post.id] = await checkIfLiked(post.id, user.id);
        }
        
        setLikedPosts(likedStatus);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLikePost = async (postId: string) => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }
    
    try {
      const isLiked = likedPosts[postId];
      
      if (isLiked) {
        await unlikePost(postId, user.id);
        
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1) } 
            : post
        ));
      } else {
        await likePost(postId, user.id);
        
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + 1 } 
            : post
        ));
      }
      
      // Toggle liked status
      setLikedPosts({
        ...likedPosts,
        [postId]: !isLiked
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };
  
  const handleCloneTrip = async (tripId: string) => {
    if (!user) {
      alert('Please log in to clone trips');
      return;
    }
    
    try {
      await cloneTrip(tripId, user.id);
      alert('Trip cloned successfully! Check your My Trips section.');
    } catch (error) {
      console.error('Error cloning trip:', error);
      alert('Failed to clone trip. Please try again.');
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
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Filter size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Search size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2" onClick={fetchPostsData} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
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
                onLike={() => handleLikePost(post.id)}
                onComment={() => alert('Comment feature coming soon')}
                onShare={() => alert('Share feature coming soon')}
                onCloneTrip={() => handleCloneTrip(post.trip_id)}
                isLiked={likedPosts[post.id]}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Xplore;