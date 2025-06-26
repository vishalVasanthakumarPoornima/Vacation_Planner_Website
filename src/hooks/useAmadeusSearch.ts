
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

interface AmadeusSearchParams {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  plan: 'economic' | 'business' | 'luxury';
  budget?: number;
}

interface FlightResult {
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

interface HotelResult {
  name: string;
  address: string;
  rating: string;
  price: string;
  currency: string;
}

interface ActivityResult {
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

interface AmadeusSearchResult {
  flight: FlightResult | null;
  hotel: HotelResult | null;
  activity: ActivityResult | null;
  plan: string;
  budget: BudgetBreakdown;
  summary: {
    totalFlights: number;
    totalHotels: number;
    totalActivities: number;
  };
}

export const useAmadeusSearch = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AmadeusSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const supabase = createClient(
    'https://uitjybcouesntnulhrvf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdGp5YmNvdWVzbnRudWxocnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODk2MzIsImV4cCI6MjA2NjQ2NTYzMn0.p2bVkG4QUJKFyL4xxiKc8C4q86krg89jmF6ifjVh6MU'
  );

  const searchVacationOptions = async (params: AmadeusSearchParams): Promise<AmadeusSearchResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling Amadeus search with params:', params);
      
      const { data, error: functionError } = await supabase.functions.invoke('amadeus-search', {
        body: params,
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data returned from search');
      }

      console.log('Amadeus search results:', data);
      setResult(data);
      
      // Show budget-aware toast message
      if (data.budget?.budgetExceeded && params.budget) {
        toast({
          title: "Budget Alert!",
          description: `Your selection exceeds budget by $${data.budget.exceedAmount.toFixed(2)}. Total cost: $${data.budget.totalCost.toFixed(2)} vs Budget: $${params.budget}`,
          variant: "destructive"
        });
      } else if (params.budget) {
        toast({
          title: "Search Complete!",
          description: `Found great options within your $${params.budget} budget. Total cost: $${data.budget.totalCost.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Search Complete!",
          description: `Found ${data.summary.totalFlights} flights, ${data.summary.totalHotels} hotels, and ${data.summary.totalActivities} activities.`,
        });
      }

      return data;
    } catch (error) {
      console.error('Error searching vacation options:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Search Failed",
        description: `Unable to search vacation options: ${errorMessage}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchVacationOptions,
    result,
    loading,
    error,
    setResult
  };
};
