
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plane, Crown } from 'lucide-react';

interface PlanSelectorProps {
  onPlanSelect: (plan: 'economic' | 'business' | 'luxury') => void;
  selectedPlan?: 'economic' | 'business' | 'luxury';
}

const plans = [
  {
    id: 'economic' as const,
    title: 'Economic',
    description: 'Budget-friendly options for cost-conscious travelers',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    features: ['Cheapest flights', 'Budget accommodations', 'Free activities focus']
  },
  {
    id: 'business' as const,
    title: 'Business',
    description: 'Balanced comfort and value for most travelers',
    icon: Plane,
    color: 'from-blue-500 to-purple-500',
    features: ['Mid-range flights', 'Comfortable hotels', 'Mix of free & paid activities']
  },
  {
    id: 'luxury' as const,
    title: 'Luxury',
    description: 'Premium experiences for those who want the best',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    features: ['Premium flights', 'Luxury accommodations', 'Exclusive experiences']
  }
];

const PlanSelector = ({ onPlanSelect, selectedPlan }: PlanSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Choose Your Travel Style
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select a plan that matches your preferences and budget
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-xl bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => onPlanSelect(plan.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                  {plan.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full mt-4 ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelector;
