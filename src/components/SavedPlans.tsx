
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Eye } from 'lucide-react';
import { useVacationPlans } from '@/hooks/useVacationPlans';
import { format } from 'date-fns';

interface SavedPlan {
  id: string;
  starting_location: string;
  destination: string;
  start_date: string;
  end_date: string;
  number_of_people: number;
  budget: number;
  created_at: string;
}

interface SavedPlansProps {
  onBack: () => void;
  onSelectPlan: (plan: SavedPlan) => void;
}

const SavedPlans = ({ onBack, onSelectPlan }: SavedPlansProps) => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const { getUserVacationPlans, loading } = useVacationPlans();

  useEffect(() => {
    const loadPlans = async () => {
      const userPlans = await getUserVacationPlans();
      setPlans(userPlans);
    };
    loadPlans();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                My Vacation Plans
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                View and manage your saved vacation plans
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto mb-2 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No vacation plans yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Create your first vacation plan to see it here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Route</p>
                            <p className="font-medium text-sm truncate">
                              {plan.starting_location} → {plan.destination}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dates</p>
                            <p className="font-medium text-sm">
                              {format(new Date(plan.start_date), 'MMM dd')} - {format(new Date(plan.end_date), 'MMM dd')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-orange-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">People</p>
                            <p className="font-medium text-sm">{plan.number_of_people}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="font-medium text-sm">${plan.budget.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => onSelectPlan(plan)}
                        className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-400">
                        Created on {format(new Date(plan.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedPlans;
