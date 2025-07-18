
// Edge function for generating AI itineraries
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

// Define types
interface ItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  tags?: string[];
}

interface Activity {
  time: string;
  title: string;
  description: string;
  category?: string;
  cost?: number;
  location?: string;
}

interface ItineraryDay {
  day_number: number;
  date: string;
  activities: Activity[];
}

Deno.serve(async (req) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    "Content-Type": "application/json"
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers, status: 405 }
      );
    }

    // Parse request body
    const { destination, startDate, endDate, budget, tags = [] } = await req.json() as ItineraryParams;

    // Validate required parameters
    if (!destination || !startDate || !endDate || !budget) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://euyfzoedsrlusvogtdue.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the database function to generate itinerary
    const { data, error } = await supabase.rpc('generate_itinerary', {
      p_destination: destination,
      p_start_date: startDate,
      p_end_date: endDate,
      p_budget: budget,
      p_tags: tags
    });

    if (error) {
      console.error('Error generating itinerary:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate itinerary' }),
        { headers, status: 500 }
      );
    }

    // Return the generated itinerary
    return new Response(
      JSON.stringify({ itinerary: data }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers, status: 500 }
    );
  }
});