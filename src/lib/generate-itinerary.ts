
import { supabase } from './supabase';

export interface ItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests?: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  category?: string;
  cost?: number;
  location?: string;
}

export interface ItineraryDay {
  day_number: number;
  date: string;
  activities: Activity[];
}

// Function to generate an AI itinerary
export async function generateItinerary(params: ItineraryParams): Promise<ItineraryDay[]> {
  try {
    // In a real app, this would call the Supabase Edge Function
    // For now, we'll generate a mock itinerary
    
    const { destination, startDate, endDate, budget, interests = [] } = params;
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Calculate daily budget
    const dailyBudget = budget / dayCount;
    
    // Generate itinerary
    const itinerary: ItineraryDay[] = [];
    
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      // Generate activities for this day
      const activities: Activity[] = [];
      
      if (i === 0) {
        // First day activities
        activities.push({
          time: '09:00',
          title: 'Arrival & Check-in',
          description: `Arrive at ${destination} and check in to your accommodation`,
          category: 'transportation',
          cost: Math.round(dailyBudget * 0.1)
        });
        
        activities.push({
          time: '12:00',
          title: 'Local Lunch',
          description: `Enjoy authentic ${destination} cuisine at a popular local restaurant`,
          category: 'food',
          cost: Math.round(dailyBudget * 0.15)
        });
        
        activities.push({
          time: '14:00',
          title: 'City Orientation Tour',
          description: `Get familiar with ${destination} on a guided walking tour`,
          category: 'sightseeing',
          cost: Math.round(dailyBudget * 0.2)
        });
        
        activities.push({
          time: '19:00',
          title: 'Welcome Dinner',
          description: 'Savor local specialties at a highly-rated restaurant',
          category: 'food',
          cost: Math.round(dailyBudget * 0.25)
        });
      } else if (i === dayCount - 1) {
        // Last day activities
        activities.push({
          time: '09:00',
          title: 'Breakfast & Packing',
          description: 'Enjoy your final breakfast and prepare for departure',
          category: 'food',
          cost: Math.round(dailyBudget * 0.1)
        });
        
        activities.push({
          time: '11:00',
          title: 'Last-minute Shopping',
          description: `Pick up souvenirs and gifts from ${destination}`,
          category: 'shopping',
          cost: Math.round(dailyBudget * 0.2)
        });
        
        activities.push({
          time: '14:00',
          title: 'Departure',
          description: 'Check out and head to the airport/station',
          category: 'transportation',
          cost: Math.round(dailyBudget * 0.1)
        });
      } else {
        // Middle day activities - alternate between different types
        if (i % 3 === 0) {
          // Nature/outdoors day
          activities.push({
            time: '08:00',
            title: 'Nature Excursion',
            description: `Full-day trip to natural attractions near ${destination}`,
            category: 'nature',
            cost: Math.round(dailyBudget * 0.4)
          });
          
          activities.push({
            time: '13:00',
            title: 'Picnic Lunch',
            description: 'Enjoy a picnic lunch amidst beautiful scenery',
            category: 'food',
            cost: Math.round(dailyBudget * 0.1)
          });
          
          activities.push({
            time: '19:00',
            title: 'Relaxing Dinner',
            description: 'Unwind with dinner after an active day outdoors',
            category: 'food',
            cost: Math.round(dailyBudget * 0.2)
          });
        } else if (i % 3 === 1) {
          // Cultural day
          activities.push({
            time: '09:00',
            title: 'Museum Visit',
            description: `Explore the cultural heritage at ${destination} Museum`,
            category: 'culture',
            cost: Math.round(dailyBudget * 0.15)
          });
          
          activities.push({
            time: '13:00',
            title: 'Local Eatery',
            description: 'Lunch at an authentic local establishment',
            category: 'food',
            cost: Math.round(dailyBudget * 0.15)
          });
          
          activities.push({
            time: '15:00',
            title: 'Historical Sites Tour',
            description: `Visit important historical landmarks in ${destination}`,
            category: 'sightseeing',
            cost: Math.round(dailyBudget * 0.2)
          });
          
          activities.push({
            time: '19:00',
            title: 'Cultural Show & Dinner',
            description: 'Experience local performing arts while enjoying dinner',
            category: 'entertainment',
            cost: Math.round(dailyBudget * 0.3)
          });
        } else {
          // Leisure/shopping day
          activities.push({
            time: '10:00',
            title: 'Leisure Morning',
            description: 'Relaxed start with coffee at a local café',
            category: 'leisure',
            cost: Math.round(dailyBudget * 0.05)
          });
          
          activities.push({
            time: '12:00',
            title: 'Shopping District',
            description: `Explore the markets and shops of ${destination}`,
            category: 'shopping',
            cost: Math.round(dailyBudget * 0.3)
          });
          
          activities.push({
            time: '16:00',
            title: 'Spa Treatment',
            description: 'Relax with a spa session or massage',
            category: 'wellness',
            cost: Math.round(dailyBudget * 0.25)
          });
          
          activities.push({
            time: '19:00',
            title: 'Gourmet Dinner',
            description: 'Fine dining experience at a top restaurant',
            category: 'food',
            cost: Math.round(dailyBudget * 0.3)
          });
        }
      }
      
      // Add this day to the itinerary
      itinerary.push({
        day_number: i + 1,
        date: formattedDate,
        activities
      });
    }
    
    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}

// Function to save an itinerary to the database
export async function saveItinerary(tripId: string, itinerary: ItineraryDay[]) {
  try {
    // First delete any existing itinerary days for this trip
    await supabase
      .from('itineraries')
      .delete()
      .eq('trip_id', tripId);
    
    // Then insert the new itinerary days
    for (const day of itinerary) {
      await supabase
        .from('itineraries')
        .insert({
          trip_id: tripId,
          day_number: day.day_number,
          date: day.date,
          activities: day.activities
        });
    }
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw error;
  }
}