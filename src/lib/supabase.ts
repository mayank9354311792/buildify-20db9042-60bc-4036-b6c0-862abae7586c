
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euyfzoedsrlusvogtdue.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWZ6b2Vkc3JsdXN2b2d0ZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTkyNjUsImV4cCI6MjA2Nzc5NTI2NX0.VvNWStC-orYXRG15IadJmUQZdmcsjgO6sYnSbntO2yA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  username: string
  avatar_url?: string
}

export type Trip = {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  interests: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  is_public: boolean
  created_at: string
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
  location?: string
  cost?: number
  category?: 'food' | 'sightseeing' | 'transportation' | 'accommodation' | 'entertainment' | 'other'
}

export type Booking = {
  id: string
  trip_id: string
  user_id: string
  type: 'flight' | 'hotel' | 'train'
  details: any
  confirmation_code?: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export type SocialPost = {
  id: string
  user_id: string
  trip_id: string
  content?: string
  image_urls: string[]
  likes_count: number
  created_at: string
  user?: User
  trip?: Trip
}

export type Badge = {
  id: string
  user_id: string
  badge_name: string
  badge_description?: string
  badge_image_url?: string
  earned_at: string
}

export type WishDestination = {
  id: string
  user_id: string
  destination: string
  notes?: string
  latitude?: number
  longitude?: number
}