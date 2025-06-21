
import React from 'react';
import { MapPin, Plane } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6 space-x-4">
          <Plane className="w-12 h-12 text-orange-300 animate-bounce" />
          <MapPin className="w-12 h-12 text-pink-300 animate-pulse" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          Vacation
          <span className="block text-orange-300">Planner</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Your Dream Trip, Perfectly Planned!
        </p>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
            <span>Personalized Planning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            <span>Budget Optimization</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
