
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euyfzoedsrlusvogtdue.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWZ6b2Vkc3JsdXN2b2d0ZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTkyNjUsImV4cCI6MjA2Nzc5NTI2NX0.VvNWStC-orYXRG15IadJmUQZdmcsjgO6sYnSbntO2yA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type User = {
  id: string
  email: string
  username: string
  avatar_url?: string
  is_host: boolean
  bio?: string
  created_at: string
}

export type Trip = {
  id: string
  user_id: string
  title: string
  source?: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  is_public: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  cloned_from?: string
  tags?: string[]
}

export type ItineraryDay = {
  id: string
  trip_id: string
  day_number: number
  date: string
  activities: Activity[]
}

export type Activity = {
  time: string
  title: string
  description: string
  category?: 'food' | 'sightseeing' | 'transportation' | 'accommodation' | 'entertainment' | 'shopping' | 'nature' | 'culture' | 'leisure' | 'wellness' | 'other'
  cost?: number
  location?: string
}

export type Booking = {
  id: string
  trip_id: string
  user_id: string
  type: 'flight' | 'hotel' | 'train'
  details: any
  confirmation_code?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  user_id: string
  trip_id: string
  content?: string
  image_urls: string[]
  likes_count: number
  created_at: string
  updated_at: string
  user?: User
  trip?: Trip
}

export type PostLike = {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export type WishDestination = {
  id: string
  user_id: string
  destination: string
  notes?: string
  latitude?: number
  longitude?: number
  created_at: string
}

export type TravelBadge = {
  id: string
  user_id: string
  badge_name: string
  badge_description?: string
  badge_image_url?: string
  earned_at: string
}

export type UserFollow = {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// Helper functions for database operations
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as User;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
}

export async function fetchTrips(userId: string, status?: string) {
  let query = supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Trip[];
}

export async function fetchTrip(tripId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single();
  
  if (error) throw error;
  return data as Trip;
}

export async function createTrip(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('trips')
    .insert(trip)
    .select()
    .single();
  
  if (error) throw error;
  return data as Trip;
}

export async function updateTrip(tripId: string, updates: Partial<Trip>) {
  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', tripId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Trip;
}

export async function deleteTrip(tripId: string) {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId);
  
  if (error) throw error;
}

export async function fetchItinerary(tripId: string) {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true });
  
  if (error) throw error;
  return data as ItineraryDay[];
}

export async function saveItinerary(tripId: string, itinerary: Omit<ItineraryDay, 'id' | 'created_at' | 'updated_at'>[]) {
  // First delete any existing itinerary days for this trip
  await supabase
    .from('itineraries')
    .delete()
    .eq('trip_id', tripId);
  
  // Then insert the new itinerary days
  const { data, error } = await supabase
    .from('itineraries')
    .insert(itinerary.map(day => ({ ...day, trip_id: tripId })))
    .select();
  
  if (error) throw error;
  return data as ItineraryDay[];
}

export async function fetchPosts(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users(*),
      trip:trips(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return data as Post[];
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'user' | 'trip'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ ...post, likes_count: 0 })
    .select()
    .single();
  
  if (error) throw error;
  return data as Post;
}

export async function likePost(postId: string, userId: string) {
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId });
  
  if (error) throw error;
}

export async function unlikePost(postId: string, userId: string) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  
  if (error) throw error;
}

export async function checkIfLiked(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
  return !!data;
}

export async function fetchWishDestinations(userId: string) {
  const { data, error } = await supabase
    .from('wish_destinations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as WishDestination[];
}

export async function addWishDestination(wishDest: Omit<WishDestination, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('wish_destinations')
    .insert(wishDest)
    .select()
    .single();
  
  if (error) throw error;
  return data as WishDestination;
}

export async function removeWishDestination(wishDestId: string) {
  const { error } = await supabase
    .from('wish_destinations')
    .delete()
    .eq('id', wishDestId);
  
  if (error) throw error;
}

export async function fetchTravelBadges(userId: string) {
  const { data, error } = await supabase
    .from('travel_passport')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  
  if (error) throw error;
  return data as TravelBadge[];
}

export async function cloneTrip(tripId: string, userId: string) {
  // Call the RPC function we created in the database
  const { data, error } = await supabase
    .rpc('clone_trip', {
      p_trip_id: tripId,
      p_user_id: userId
    });
  
  if (error) throw error;
  return data as string; // Returns the new trip ID
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  
  if (error) throw error;
  return data as Booking;
}

export async function fetchBookings(tripId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Booking[];
}

export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('user_follows')
    .insert({ follower_id: followerId, following_id: followingId });
  
  if (error) throw error;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  
  if (error) throw error;
}

export async function checkIfFollowing(followerId: string, followingId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}