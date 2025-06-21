
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, DollarSign, Plane, Hotel, Car, Camera, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface VacationFormData {
  startingLocation: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  numberOfPeople: number;
  budget: number;
}

interface VacationResultsProps {
  data: VacationFormData;
  onReset: () => void;
}

const VacationResults = ({ data, onReset }: VacationResultsProps) => {
  const numberOfDays = data.startDate && data.endDate ? differenceInDays(data.endDate, data.startDate) : 0;
  const budgetPerPerson = Math.round(data.budget / data.numberOfPeople);
  const budgetPerDay = numberOfDays > 0 ? Math.round(data.budget / numberOfDays) : 0;
  const accommodationBudget = Math.round(data.budget * 0.4);
  const foodBudget = Math.round(data.budget * 0.3);
  const activitiesBudget = Math.round(data.budget * 0.3);

  const recommendations = [
    {
      icon: Hotel,
      title: "Accommodation",
      budget: accommodationBudget,
      suggestion: `Look for hotels or vacation rentals in the $${numberOfDays > 0 ? Math.round(accommodationBudget / numberOfDays) : 0}/night range`
    },
    {
      icon: Car,
      title: "Transportation",
      budget: foodBudget,
      suggestion: "Consider local transport, car rentals, or flight connections"
    },
    {
      icon: Camera,
      title: "Activities & Dining",
      budget: activitiesBudget,
      suggestion: "Budget for tours, attractions, meals, and experiences"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
            Your Vacation Plan
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Here's your personalized vacation breakdown
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Trip Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{data.startingLocation} → {data.destination}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-green-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{numberOfDays} days</p>
                  {data.startDate && data.endDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(data.startDate, 'MMM dd')} - {format(data.endDate, 'MMM dd')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-orange-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Travelers</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{data.numberOfPeople} {data.numberOfPeople === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                  <p className="font-semibold text-gray-800 dark:text-white">${data.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Budget Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <rec.icon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800 dark:text-white">{rec.title}</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">${rec.budget.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Per Person/Day Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Per Person Budget</h3>
              <p className="text-3xl font-bold">${budgetPerPerson.toLocaleString()}</p>
              <p className="text-blue-100">Total budget divided by travelers</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Daily Budget</h3>
              <p className="text-3xl font-bold">${budgetPerDay.toLocaleString()}</p>
              <p className="text-green-100">Total budget divided by days</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-4">
            <Button 
              onClick={onReset}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Plan Another Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VacationResults;
