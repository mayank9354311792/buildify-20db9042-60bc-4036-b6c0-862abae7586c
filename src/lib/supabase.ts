
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://euyfzoedsrlusvogtdue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWZ6b2Vkc3JsdXN2b2d0ZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTkyNjUsImV4cCI6MjA2Nzc5NTI2NX0.VvNWStC-orYXRG15IadJmUQZdmcsjgO6sYnSbntO2yA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget: number | null
          interests: string[] | null
          status: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget?: number | null
          interests?: string[] | null
          status?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number | null
          interests?: string[] | null
          status?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          trip_id: string
          day_number: number
          date: string
          activities: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          day_number: number
          date: string
          activities?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          day_number?: number
          date?: string
          activities?: Json
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          type: string
          details: Json
          confirmation_code: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          type: string
          details: Json
          confirmation_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          type?: string
          details?: Json
          confirmation_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          user_id: string
          trip_id: string
          content: string | null
          image_urls: string[] | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trip_id: string
          content?: string | null
          image_urls?: string[] | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string
          content?: string | null
          image_urls?: string[] | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          badge_description: string | null
          badge_image_url: string | null
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          badge_description?: string | null
          badge_image_url?: string | null
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          badge_description?: string | null
          badge_image_url?: string | null
          earned_at?: string
        }
      }
      wish_destinations: {
        Row: {
          id: string
          user_id: string
          destination: string
          notes: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination: string
          notes?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          destination?: string
          notes?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
      }
    }
  }
}