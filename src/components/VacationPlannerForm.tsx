
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Calendar as CalendarIcon, Users, DollarSign, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VacationFormData {
  startingLocation: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  numberOfPeople: number;
  budget: number;
}

interface VacationPlannerFormProps {
  onSubmit: (data: VacationFormData) => void;
}

const VacationPlannerForm = ({ onSubmit }: VacationPlannerFormProps) => {
  const [formData, setFormData] = useState<VacationFormData>({
    startingLocation: '',
    destination: '',
    startDate: undefined,
    endDate: undefined,
    numberOfPeople: 2,
    budget: 2000
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startingLocation.trim()) {
      newErrors.startingLocation = 'Starting location is required';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'Must be at least 1 person';
    }
    if (formData.budget < 100) {
      newErrors.budget = 'Budget must be at least $100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof VacationFormData, value: string | number | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Plan Your Vacation
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Tell us about your dream trip and we'll help you plan it perfectly
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="startingLocation" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                Starting Location
              </Label>
              <Input
                id="startingLocation"
                type="text"
                placeholder="Where are you starting from?"
                value={formData.startingLocation}
                onChange={(e) => handleChange('startingLocation', e.target.value)}
                className={`transition-all duration-200 ${errors.startingLocation ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {errors.startingLocation && (
                <p className="text-red-500 text-sm">{errors.startingLocation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                Destination
              </Label>
              <Input
                id="destination"
                type="text"
                placeholder="Where do you want to go?"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                className={`transition-all duration-200 ${errors.destination ? 'border-red-500 focus:border-red-500' : 'focus:border-purple-500'}`}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm">{errors.destination}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                        errors.startDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleChange('startDate', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 mr-2 text-orange-500" />
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleChange('endDate', date)}
                      disabled={(date) => date < new Date() || (formData.startDate && date <= formData.startDate)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfPeople" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 mr-2 text-orange-500" />
                  Number of People
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleChange('numberOfPeople', parseInt(e.target.value) || 0)}
                  className={`transition-all duration-200 ${errors.numberOfPeople ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                />
                {errors.numberOfPeople && (
                  <p className="text-red-500 text-sm">{errors.numberOfPeople}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                  Trip Budget (USD)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  min="100"
                  step="50"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
                  className={`transition-all duration-200 ${errors.budget ? 'border-red-500 focus:border-red-500' : 'focus:border-emerald-500'}`}
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm">{errors.budget}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plane className="w-5 h-5 mr-2" />
              Plan My Vacation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VacationPlannerForm;
