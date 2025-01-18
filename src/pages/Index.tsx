import React from 'react';
import MealPlanner from '@/components/home/meal-planner/MealPlanner';
import CalorieBurner from '@/components/home/CalorieBurner';
import ServiceCards from '@/components/home/ServiceCards';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Banner - Full width container */}
      <section className="relative w-full h-[500px] md:h-[750px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50">
          <img 
            src="/lovable-uploads/Banner01.jpg" 
            alt="Hero Banner" 
            className="w-full h-full object-cover -z-10"
          />
        </div>
        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-4">
            Your Ultimate Platform for
            <span className="text-gradient"> Fitness & Sports</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
            Transform your fitness journey with personalized meal plans, workout tracking, and expert guidance.
          </p>
        </div>
      </section>

      {/* Main content container with responsive padding */}
      <div className="px-4 md:container md:mx-auto py-8 space-y-8 md:space-y-12">
        {/* Service Cards - Smaller on mobile */}
        <div className="max-w-lg mx-auto md:max-w-none">
          <ServiceCards />
        </div>

        {/* Full-width sections for Meal Planner and Calorie Burner */}
        <div className="w-full">
          <MealPlanner />
        </div>

        <div className="w-full">
          <CalorieBurner />
        </div>
      </div>
    </div>
  );
};

export default Index;
