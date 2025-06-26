
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AmadeusSearchRequest {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  plan: 'economic' | 'business' | 'luxury';
  budget?: number; // Add budget parameter
}

interface FlightData {
  airline: string;
  departure_city: string;
  departure_airport: string;
  arrival_city: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: string;
  currency: string;
}

interface HotelData {
  name: string;
  address: string;
  rating: string;
  price: string;
  currency: string;
}

interface ActivityData {
  name: string;
  description: string;
  price: string;
  currency: string;
}

interface BudgetBreakdown {
  flightCost: number;
  hotelCost: number;
  activityCost: number;
  totalCost: number;
  remainingBudget: number;
  budgetExceeded: boolean;
  exceedAmount: number;
}

class AmadeusClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    console.log('Getting Amadeus access token...');
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      console.error('Failed to get access token:', await response.text());
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    console.log('Access token obtained successfully');
    return this.accessToken;
  }

  async searchFlights(origin: string, destination: string, departureDate: string, adults: number): Promise<FlightData[]> {
    const token = await this.getAccessToken();
    
    console.log(`Searching flights from ${origin} to ${destination} on ${departureDate} for ${adults} adults`);
    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Flight search failed:', await response.text());
      throw new Error('Failed to search flights');
    }

    const data = await response.json();
    console.log(`Found ${data.data?.length || 0} flights`);
    
    return data.data?.map((flight: any) => {
      const itinerary = flight.itineraries[0];
      const firstSegment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];

      return {
        airline: firstSegment.carrierCode,
        departure_city: firstSegment.departure.iataCode,
        departure_airport: firstSegment.departure.iataCode,
        arrival_city: lastSegment.arrival.iataCode,
        arrival_airport: lastSegment.arrival.iataCode,
        departure_time: firstSegment.departure.at,
        arrival_time: lastSegment.arrival.at,
        duration: itinerary.duration,
        price: flight.price.grandTotal,
        currency: flight.price.currency
      };
    }) || [];
  }

  async searchHotels(destination: string): Promise<any[]> {
    const token = await this.getAccessToken();
    
    console.log(`Searching hotels in ${destination}`);
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${destination}&radius=10&radiusUnit=KM&ratings=1,2,3,4,5`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Hotel search failed:', await response.text());
      throw new Error('Failed to search hotels');
    }

    const data = await response.json();
    console.log(`Found ${data.data?.length || 0} hotels`);
    return data.data || [];
  }

  async getHotelPrices(hotelIds: string[]): Promise<HotelData[]> {
    const token = await this.getAccessToken();
    const batchSize = 10;
    const hotelResults: HotelData[] = [];

    console.log(`Getting prices for ${hotelIds.length} hotels in batches of ${batchSize}`);

    for (let i = 0; i < hotelIds.length; i += batchSize) {
      const batch = hotelIds.slice(i, i + batchSize);
      const hotelIdsStr = batch.join(',');

      try {
        console.log(`Fetching prices for batch: ${hotelIdsStr}`);
        const response = await fetch(
          `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsStr}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.log(`Batch failed, skipping: ${await response.text()}`);
          continue;
        }

        const data = await response.json();
        
        data.data?.forEach((hotel: any) => {
          const offers = hotel.offers || [];
          if (offers.length > 0) {
            const hotelName = hotel.hotel?.name || 'Unknown';
            const totalPrice = offers[0].price?.total || '0';
            const address = hotel.hotel?.address || {};
            
            hotelResults.push({
              name: hotelName,
              address: `${address.lines?.[0] || ''}, ${address.cityName || ''}`.trim(),
              rating: hotel.hotel?.rating || 'N/A',
              price: totalPrice,
              currency: offers[0].price?.currency || 'USD'
            });
          }
        });
      } catch (error) {
        console.error('Error fetching hotel batch:', error);
      }
    }

    console.log(`Total hotels with prices: ${hotelResults.length}`);
    return hotelResults;
  }

  async searchActivities(latitude: number, longitude: number): Promise<ActivityData[]> {
    const token = await this.getAccessToken();
    
    console.log(`Searching activities at coordinates ${latitude}, ${longitude}`);
    const response = await fetch(
      `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=20`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Activities search failed:', await response.text());
      throw new Error('Failed to search activities');
    }

    const data = await response.json();
    console.log(`Found ${data.data?.length || 0} activities`);
    
    return data.data?.map((activity: any) => ({
      name: activity.name || 'Unknown Activity',
      description: activity.description || 'No description available',
      price: activity.price?.amount || '0',
      currency: activity.price?.currencyCode || 'USD'
    })) || [];
  }
}

function selectByPlan<T extends { price: string }>(items: T[], plan: 'economic' | 'business' | 'luxury'): T | null {
  if (items.length === 0) return null;
  
  // Sort by price (convert to number for comparison)
  const sorted = [...items].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  
  switch (plan) {
    case 'economic':
      return sorted[0]; // Cheapest
    case 'luxury':
      return sorted[sorted.length - 1]; // Most expensive
    case 'business':
    default:
      return sorted[Math.floor(sorted.length / 2)]; // Middle price
  }
}

function selectActivityWithinBudget(activities: ActivityData[], remainingBudget: number, plan: 'economic' | 'business' | 'luxury'): { activity: ActivityData | null, budgetExceeded: boolean, exceedAmount: number } {
  if (activities.length === 0) {
    return { activity: null, budgetExceeded: false, exceedAmount: 0 };
  }

  // Filter activities within budget first
  const affordableActivities = activities.filter(activity => parseFloat(activity.price) <= remainingBudget);
  
  if (affordableActivities.length > 0) {
    // Select from affordable activities based on plan
    const selectedActivity = selectByPlan(affordableActivities, plan);
    return { 
      activity: selectedActivity, 
      budgetExceeded: false, 
      exceedAmount: 0 
    };
  }

  // If no activities within budget, select based on plan and calculate exceed amount
  const selectedActivity = selectByPlan(activities, plan);
  if (!selectedActivity) {
    return { activity: null, budgetExceeded: false, exceedAmount: 0 };
  }

  const exceedAmount = parseFloat(selectedActivity.price) - remainingBudget;
  const budgetExceeded = exceedAmount > 0;

  console.log(`Selected activity exceeds budget by $${exceedAmount.toFixed(2)}`);
  
  return { 
    activity: selectedActivity, 
    budgetExceeded, 
    exceedAmount: Math.max(0, exceedAmount) 
  };
}

function calculateBudgetBreakdown(
  flight: FlightData | null, 
  hotel: HotelData | null, 
  activity: ActivityData | null,
  budget?: number
): BudgetBreakdown {
  const flightCost = flight ? parseFloat(flight.price) : 0;
  const hotelCost = hotel ? parseFloat(hotel.price) : 0;
  const activityCost = activity ? parseFloat(activity.price) : 0;
  const totalCost = flightCost + hotelCost + activityCost;
  
  const userBudget = budget || 0;
  const remainingBudget = userBudget - totalCost;
  const budgetExceeded = totalCost > userBudget && userBudget > 0;
  const exceedAmount = budgetExceeded ? totalCost - userBudget : 0;

  return {
    flightCost,
    hotelCost,
    activityCost,
    totalCost,
    remainingBudget,
    budgetExceeded,
    exceedAmount
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Amadeus search function called');
    const { origin, destination, startDate, endDate, adults, plan, budget }: AmadeusSearchRequest = await req.json()
    console.log('Request params:', { origin, destination, startDate, endDate, adults, plan, budget });

    // Get Amadeus credentials from Supabase secrets
    const clientId = Deno.env.get('AMADEUS_CLIENT_ID')
    const clientSecret = Deno.env.get('AMADEUS_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Amadeus credentials not configured');
      throw new Error('Amadeus credentials not configured')
    }

    console.log('Initializing Amadeus client');
    const amadeus = new AmadeusClient(clientId, clientSecret)

    // Step 1: Search and select flights
    console.log('Step 1: Searching flights...')
    const flights = await amadeus.searchFlights(origin, destination, startDate, adults)
    const selectedFlight = selectByPlan(flights, plan)
    console.log('Selected flight:', selectedFlight?.airline || 'None');

    // Step 2: Search and select hotels
    console.log('Step 2: Searching hotels...')
    const hotelList = await amadeus.searchHotels(destination)
    const hotelIds = hotelList.map(hotel => hotel.hotelId).filter(Boolean).slice(0, 50)
    console.log(`Got ${hotelIds.length} hotel IDs`);
    
    const hotelsWithPrices = await amadeus.getHotelPrices(hotelIds)
    const selectedHotel = selectByPlan(hotelsWithPrices, plan)
    console.log('Selected hotel:', selectedHotel?.name || 'None');

    // Calculate remaining budget after flight and hotel
    const flightCost = selectedFlight ? parseFloat(selectedFlight.price) : 0;
    const hotelCost = selectedHotel ? parseFloat(selectedHotel.price) : 0;
    const remainingBudgetForActivities = budget ? budget - flightCost - hotelCost : Infinity;

    console.log(`Flight cost: $${flightCost}, Hotel cost: $${hotelCost}, Remaining budget for activities: $${remainingBudgetForActivities}`);

    // Step 3: Search activities and select within remaining budget
    let selectedActivity: ActivityData | null = null;
    let activityBudgetExceeded = false;
    let activityExceedAmount = 0;
    let activities: ActivityData[] = [];
    
    console.log('Step 3: Searching activities...')
    if (hotelList.length > 0) {
      const hotelWithCoords = hotelList.find(h => h.geoCode?.latitude && h.geoCode?.longitude)
      if (hotelWithCoords) {
        console.log(`Using coordinates: ${hotelWithCoords.geoCode.latitude}, ${hotelWithCoords.geoCode.longitude}`);
        activities = await amadeus.searchActivities(
          hotelWithCoords.geoCode.latitude,
          hotelWithCoords.geoCode.longitude
        )
        
        if (budget && remainingBudgetForActivities > 0) {
          const activitySelection = selectActivityWithinBudget(activities, remainingBudgetForActivities, plan);
          selectedActivity = activitySelection.activity;
          activityBudgetExceeded = activitySelection.budgetExceeded;
          activityExceedAmount = activitySelection.exceedAmount;
        } else {
          selectedActivity = selectByPlan(activities, plan);
        }
        
        console.log('Selected activity:', selectedActivity?.name || 'None');
      } else {
        console.log('No hotel coordinates found');
      }
    }

    // Calculate final budget breakdown
    const budgetBreakdown = calculateBudgetBreakdown(selectedFlight, selectedHotel, selectedActivity, budget);

    const result = {
      flight: selectedFlight,
      hotel: selectedHotel,
      activity: selectedActivity,
      plan: plan,
      budget: budgetBreakdown,
      summary: {
        totalFlights: flights.length,
        totalHotels: hotelsWithPrices.length,
        totalActivities: activities.length
      }
    }

    console.log('Search completed successfully');
    console.log('Result summary:', result.summary);
    console.log('Budget breakdown:', budgetBreakdown);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Amadeus search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'No stack trace available'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
