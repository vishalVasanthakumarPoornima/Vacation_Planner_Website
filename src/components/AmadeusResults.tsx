
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Hotel, MapPin, Clock, Star, DollarSign, RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface BudgetBreakdown {
  flightCost: number;
  hotelCost: number;
  activityCost: number;
  totalCost: number;
  remainingBudget: number;
  budgetExceeded: boolean;
  exceedAmount: number;
}

interface AmadeusResultsProps {
  data: {
    flight: any;
    hotel: any;
    activity: any;
    plan: string;
    budget: BudgetBreakdown;
    summary: {
      totalFlights: number;
      totalHotels: number;
      totalActivities: number;
    };
  };
  originalFormData: any;
  onReset: () => void;
}

const AmadeusResults = ({ data, originalFormData, onReset }: AmadeusResultsProps) => {
  const { flight, hotel, activity, plan, budget } = data;
  
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'economic': return 'from-green-500 to-emerald-500';
      case 'business': return 'from-blue-500 to-purple-500';
      case 'luxury': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getPlanTitle = (plan: string) => {
    switch (plan) {
      case 'economic': return 'Economic Plan';
      case 'business': return 'Business Plan';
      case 'luxury': return 'Luxury Plan';
      default: return 'Travel Plan';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), 'MMM dd, yyyy - HH:mm');
    } catch {
      return dateTimeString;
    }
  };

  const formatDuration = (duration: string) => {
    // Convert PT format (e.g., "PT2H30M") to readable format
    if (duration.startsWith('PT')) {
      const hours = duration.match(/(\d+)H/)?.[1] || '0';
      const minutes = duration.match(/(\d+)M/)?.[1] || '0';
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="text-center">
          <div className={`inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-gradient-to-r text-white font-semibold ${getPlanColor(plan)}`}>
            {getPlanTitle(plan)}
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
            Your Personalized Travel Plan
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            {originalFormData.startingLocation} → {originalFormData.destination}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Budget Summary Section */}
          {originalFormData.budget && (
            <Card className={`border-2 ${budget?.budgetExceeded ? 'border-red-200 dark:border-red-800' : 'border-green-200 dark:border-green-800'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl font-bold text-center flex items-center justify-center ${budget?.budgetExceeded ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {budget?.budgetExceeded ? (
                    <>
                      <TrendingUp className="w-6 h-6 mr-2" />
                      Budget Alert
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-6 h-6 mr-2" />
                      Within Budget
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-center">
                  {budget?.budgetExceeded 
                    ? `Your selection exceeds budget by $${budget.exceedAmount.toFixed(2)}`
                    : `You're saving $${Math.abs(budget.remainingBudget).toFixed(2)} from your budget`
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">${budget?.flightCost?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Flight Cost</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">${budget?.hotelCost?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hotel Cost</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">${budget?.activityCost?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activity Cost</p>
                  </div>
                  <div className={`p-4 rounded-lg ${budget?.budgetExceeded ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                    <p className={`text-2xl font-bold ${budget?.budgetExceeded ? 'text-red-600' : 'text-green-600'}`}>
                      ${budget?.totalCost?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Your Budget:</span>
                    <span className="text-lg">${originalFormData.budget?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="text-lg">${budget?.totalCost?.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className={`flex justify-between items-center font-bold text-lg ${budget?.budgetExceeded ? 'text-red-600' : 'text-green-600'}`}>
                    <span>{budget?.budgetExceeded ? 'Over Budget:' : 'Remaining:'}</span>
                    <span>${Math.abs(budget?.remainingBudget || 0).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results Section */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                Complete Search Results from Amadeus
              </CardTitle>
              <CardDescription className="text-center">
                Here are all the options we found for your trip
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Flight Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600 flex items-center">
                  <Plane className="w-6 h-6 mr-2" />
                  Flight Options Found: {data.summary.totalFlights}
                </h3>
                
                {flight ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3">Selected Flight for {getPlanTitle(plan)}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Airline</p>
                        <p className="font-semibold">{flight.airline}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Route</p>
                        <p className="font-semibold">{flight.departure_city} ({flight.departure_airport}) → {flight.arrival_city} ({flight.arrival_airport})</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDuration(flight.duration)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Departure</p>
                        <p className="font-semibold">{formatDateTime(flight.departure_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Arrival</p>
                        <p className="font-semibold">{formatDateTime(flight.arrival_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-bold text-xl text-green-600 flex items-center">
                          <DollarSign className="w-5 h-5" />
                          {flight.price} {flight.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    <p className="text-red-600 dark:text-red-400">No flight selected for this plan</p>
                  </div>
                )}
              </div>

              {/* Hotel Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-600 flex items-center">
                  <Hotel className="w-6 h-6 mr-2" />
                  Hotel Options Found: {data.summary.totalHotels}
                </h3>
                
                {hotel ? (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3">Selected Hotel for {getPlanTitle(plan)}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Hotel Name</p>
                        <p className="font-semibold text-lg">{hotel.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Rating</p>
                        <p className="font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {hotel.rating}/5
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 dark:text-gray-400">Address</p>
                        <p className="flex items-start">
                          <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                          {hotel.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price per night</p>
                        <p className="font-bold text-xl text-green-600 flex items-center">
                          <DollarSign className="w-5 h-5" />
                          {hotel.price} {hotel.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    <p className="text-red-600 dark:text-red-400">No hotel selected for this plan</p>
                  </div>
                )}
              </div>

              {/* Activity Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  Activity Options Found: {data.summary.totalActivities}
                </h3>
                
                {activity ? (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3">Selected Activity for {getPlanTitle(plan)}</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Activity Name</p>
                        <p className="font-semibold text-lg">{activity.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Description</p>
                        <p className="text-gray-800 dark:text-white">{activity.description}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-bold text-xl text-green-600 flex items-center">
                          <DollarSign className="w-4 h-4" />
                          {activity.price} {activity.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    <p className="text-red-600 dark:text-red-400">No activity selected for this plan</p>
                  </div>
                )}
              </div>

              {/* Search Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Complete Search Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{data.summary.totalFlights}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Flights Found</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">{data.summary.totalHotels}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Hotels Found</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{data.summary.totalActivities}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities Found</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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

export default AmadeusResults;
