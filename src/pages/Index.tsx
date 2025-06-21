
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import VacationPlannerForm from '@/components/VacationPlannerForm';
import VacationResults from '@/components/VacationResults';
import { ThemeToggle } from '@/components/ThemeToggle';

interface VacationFormData {
  startingLocation: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  numberOfPeople: number;
  budget: number;
}

const Index = () => {
  const [planData, setPlanData] = useState<VacationFormData | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = (data: VacationFormData) => {
    console.log('Vacation plan submitted:', data);
    setPlanData(data);
    setShowResults(true);
  };

  const handleReset = () => {
    setPlanData(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />
      {!showResults ? (
        <>
          <Hero />
          <div className="relative -mt-32 z-20">
            <VacationPlannerForm onSubmit={handleFormSubmit} />
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center py-12">
          {planData && (
            <VacationResults data={planData} onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
