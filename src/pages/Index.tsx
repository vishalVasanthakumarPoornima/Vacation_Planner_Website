
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVacationPlans } from '@/hooks/useVacationPlans';
import { useAmadeusSearch } from '@/hooks/useAmadeusSearch';
import Hero from '@/components/Hero';
import VacationPlannerForm from '@/components/VacationPlannerForm';
import VacationResults from '@/components/VacationResults';
import AmadeusResults from '@/components/AmadeusResults';
import PlanSelector from '@/components/PlanSelector';
import SavedPlans from '@/components/SavedPlans';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface VacationFormData {
  startingLocation: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  numberOfPeople: number;
  budget: number;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { saveVacationPlan } = useVacationPlans();
  const { searchVacationOptions, result: amadeusResult, loading: amadeusLoading } = useAmadeusSearch();
  const navigate = useNavigate();
  
  // State management
  const [planData, setPlanData] = useState<VacationFormData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'economic' | 'business' | 'luxury' | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [useAmadeus, setUseAmadeus] = useState(true); // Toggle between Amadeus and static results

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleFormSubmit = async (data: VacationFormData) => {
    console.log('Vacation plan submitted:', data);
    
    // Save to database if user is authenticated
    if (user && data.startDate && data.endDate) {
      await saveVacationPlan({
        startingLocation: data.startingLocation,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        numberOfPeople: data.numberOfPeople,
        budget: data.budget
      });
    }
    
    setPlanData(data);
    
    if (useAmadeus) {
      setShowPlanSelector(true);
    } else {
      setShowResults(true);
      setShowSavedPlans(false);
    }
  };

  const handlePlanSelect = async (plan: 'economic' | 'business' | 'luxury') => {
    setSelectedPlan(plan);
    
    if (planData && planData.startDate && planData.endDate) {
      // Convert airport codes if they're city names (this is a simplified conversion)
      const getAirportCode = (location: string) => {
        const airportMap: { [key: string]: string } = {
          'New York': 'JFK',
          'Los Angeles': 'LAX',
          'London': 'LHR',
          'Paris': 'CDG',
          'Tokyo': 'NRT',
          'Madrid': 'MAD',
          'Barcelona': 'BCN',
          'Rome': 'FCO',
          'Amsterdam': 'AMS',
          'Frankfurt': 'FRA'
          // Add more mappings as needed
        };
        
        // If it's already an airport code (3 letters), return as is
        if (location.length === 3 && location.match(/^[A-Z]{3}$/)) {
          return location;
        }
        
        // Try to find in mapping
        return airportMap[location] || location.substring(0, 3).toUpperCase();
      };

      await searchVacationOptions({
        origin: getAirportCode(planData.startingLocation),
        destination: getAirportCode(planData.destination),
        startDate: planData.startDate.toISOString().split('T')[0],
        endDate: planData.endDate.toISOString().split('T')[0],
        adults: planData.numberOfPeople,
        plan: plan,
        budget: planData.budget // Pass the budget to the search function
      });
      
      setShowPlanSelector(false);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setPlanData(null);
    setSelectedPlan(null);
    setShowResults(false);
    setShowSavedPlans(false);
    setShowPlanSelector(false);
  };

  const handleShowSavedPlans = () => {
    setShowResults(false);
    setShowSavedPlans(true);
    setShowPlanSelector(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || amadeusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {amadeusLoading && <p className="text-gray-600 dark:text-gray-400">Searching for the best travel options within your budget...</p>}
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />
      
      {/* User Menu */}
      <div className="fixed top-4 left-4 z-50 flex items-center space-x-2">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowSavedPlans}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
        >
          My Plans
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleSignOut}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {!showResults && !showSavedPlans && !showPlanSelector ? (
        <>
          <Hero />
          <div className="relative -mt-32 z-20">
            <VacationPlannerForm onSubmit={handleFormSubmit} />
          </div>
        </>
      ) : showPlanSelector ? (
        <div className="min-h-screen flex items-center justify-center py-12">
          <PlanSelector onPlanSelect={handlePlanSelect} selectedPlan={selectedPlan || undefined} />
        </div>
      ) : showSavedPlans ? (
        <div className="min-h-screen flex items-center justify-center py-12">
          <SavedPlans onBack={handleReset} onSelectPlan={(plan) => {
            setPlanData({
              startingLocation: plan.starting_location,
              destination: plan.destination,
              startDate: new Date(plan.start_date),
              endDate: new Date(plan.end_date),
              numberOfPeople: plan.number_of_people,
              budget: plan.budget
            });
            setShowSavedPlans(false);
            setShowResults(true);
          }} />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center py-12">
          {planData && (
            useAmadeus && amadeusResult ? (
              <AmadeusResults 
                data={amadeusResult} 
                originalFormData={planData}
                onReset={handleReset} 
              />
            ) : (
              <VacationResults data={planData} onReset={handleReset} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
