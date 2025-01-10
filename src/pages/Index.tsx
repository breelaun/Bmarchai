import React from 'react';
import MealPlanner from '@/components/home/meal-planner/MealPlanner';
import CalorieBurner from '@/components/home/CalorieBurner';
import ServiceCards from '@/components/home/ServiceCards';

const Index = () => {
  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Banner */}
      <section className="relative h-[750px] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50">
          <img 
            src="/lovable-uploads/Banner01.jpg" 
            alt="Hero Banner" 
            className="w-full h-full object-cover -z-10"
          />
        </div>
        <div className="relative h-full flex flex-col justify-center items-start p-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
            Your Ultimate Platform for
            <span className="text-gradient"> Fitness & Sports</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Transform your fitness journey with personalized meal plans, workout tracking, and expert guidance.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <ServiceCards />

      {/* Meal Planner */}
      <MealPlanner />

      {/* Calorie Burner */}
      <CalorieBurner />
    </div>
  );
};

export default Index;
