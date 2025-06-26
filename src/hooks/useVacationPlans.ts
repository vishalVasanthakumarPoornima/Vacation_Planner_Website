
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VacationPlan {
  id?: string;
  starting_location: string;
  destination: string;
  start_date: string;
  end_date: string;
  number_of_people: number;
  budget: number;
  created_at?: string;
  updated_at?: string;
}

export const useVacationPlans = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveVacationPlan = async (planData: {
    startingLocation: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    numberOfPeople: number;
    budget: number;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacation_plans')
        .insert({
          starting_location: planData.startingLocation,
          destination: planData.destination,
          start_date: planData.startDate.toISOString().split('T')[0],
          end_date: planData.endDate.toISOString().split('T')[0],
          number_of_people: planData.numberOfPeople,
          budget: planData.budget,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving vacation plan:', error);
        toast({
          title: "Error",
          description: "Failed to save vacation plan. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success!",
        description: "Your vacation plan has been saved.",
      });

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserVacationPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacation_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vacation plans:', error);
        toast({
          title: "Error",
          description: "Failed to load vacation plans.",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    saveVacationPlan,
    getUserVacationPlans,
    loading
  };
};
