
import { supabase } from './supabase';

export interface ItineraryDay {
  day_number: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: number;
  category?: 'food' | 'sightseeing' | 'transportation' | 'accommodation' | 'entertainment' | 'other';
}

export interface ItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  budget: number;
}

// This is a mock function that simulates AI-generated itineraries
// In a real app, this would call an AI service or API
export async function generateItinerary(params: ItineraryParams): Promise<ItineraryDay[]> {
  const { destination, startDate, endDate, interests, budget } = params;
  
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  
  // Generate a daily budget
  const dailyBudget = budget / dayCount;
  
  // Mock itinerary generation
  const itinerary: ItineraryDay[] = [];
  
  for (let i = 0; i < dayCount; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    const formattedDate = currentDate.toISOString().split('T')[0];
    
    // Generate 3-5 activities per day
    const activityCount = Math.floor(Math.random() * 3) + 3;
    const activities: Activity[] = [];
    
    // Morning activity
    activities.push({
      time: '09:00',
      title: `Explore ${destination} ${i === 0 ? 'Downtown' : 'District ' + (i + 1)}`,
      description: `Discover the beauty of ${destination} with a guided walking tour of the ${i === 0 ? 'historic downtown area' : 'local district ' + (i + 1)}.`,
      category: 'sightseeing',
      cost: Math.round(dailyBudget * 0.1)
    });
    
    // Lunch
    activities.push({
      time: '12:30',
      title: 'Local Cuisine Experience',
      description: `Enjoy authentic ${destination} cuisine at a popular local restaurant.`,
      category: 'food',
      cost: Math.round(dailyBudget * 0.15)
    });
    
    // Afternoon activity based on interests
    if (interests.includes('history') || interests.includes('culture')) {
      activities.push({
        time: '14:00',
        title: `Visit ${destination} Museum`,
        description: 'Explore the rich cultural heritage and historical artifacts of the region.',
        category: 'sightseeing',
        cost: Math.round(dailyBudget * 0.1)
      });
    } else if (interests.includes('nature') || interests.includes('outdoors')) {
      activities.push({
        time: '14:00',
        title: `Hike at ${destination} National Park`,
        description: 'Experience the natural beauty with a guided hike through scenic trails.',
        category: 'entertainment',
        cost: Math.round(dailyBudget * 0.05)
      });
    } else if (interests.includes('shopping')) {
      activities.push({
        time: '14:00',
        title: 'Shopping at Local Markets',
        description: 'Discover unique souvenirs and local crafts at the famous markets.',
        category: 'entertainment',
        cost: Math.round(dailyBudget * 0.2)
      });
    } else {
      activities.push({
        time: '14:00',
        title: 'Leisure Time',
        description: 'Enjoy some free time to explore the area at your own pace.',
        category: 'other',
        cost: 0
      });
    }
    
    // Evening activity
    activities.push({
      time: '19:00',
      title: 'Dinner Experience',
      description: `Savor a delicious dinner at a ${i % 2 === 0 ? 'rooftop' : 'waterfront'} restaurant with stunning views.`,
      category: 'food',
      cost: Math.round(dailyBudget * 0.25)
    });
    
    // Add an extra activity for some days
    if (i % 2 === 0) {
      activities.push({
        time: '21:00',
        title: 'Night Entertainment',
        description: `Experience the vibrant nightlife of ${destination} with a visit to a local ${Math.random() > 0.5 ? 'music venue' : 'cultural show'}.`,
        category: 'entertainment',
        cost: Math.round(dailyBudget * 0.15)
      });
    }
    
    itinerary.push({
      day_number: i + 1,
      date: formattedDate,
      activities
    });
  }
  
  return itinerary;
}

export async function saveItinerary(tripId: string, itinerary: ItineraryDay[]) {
  // First delete any existing itinerary days for this trip
  await supabase
    .from('itinerary_days')
    .delete()
    .eq('trip_id', tripId);
  
  // Insert new itinerary days
  for (const day of itinerary) {
    await supabase
      .from('itinerary_days')
      .insert({
        trip_id: tripId,
        day_number: day.day_number,
        date: day.date,
        activities: day.activities
      });
  }
}