import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceCards from "@/components/home/ServiceCards";
import MealPlanner from "@/components/home/MealPlanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Strength Starts At The{" "}
            <span className="text-primary">Core</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your fitness journey with expert coaching, premium equipment, and a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Join Now
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
            Our Services
          </h2>
          <ServiceCards />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-secondary p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  "Bmarchai has transformed how I manage my fitness business. The platform is intuitive and powerful."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-foreground">John Doe</p>
                    <p className="text-sm text-muted-foreground">Fitness Coach</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Planner Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
            7-Day Meal Planner
          </h2>
          <MealPlanner />
        </div>
      </section>
    </div>
  );
};

export default Index;