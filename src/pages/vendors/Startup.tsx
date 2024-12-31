import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Startup = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-heading font-bold mb-6 text-center">
        Welcome to Your Vendor Journey
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        Let's set up your vendor profile and customize your store. We'll guide you through each step of the process.
      </p>
      <Button 
        size="lg" 
        onClick={() => navigate("/vendors/new")}
        className="gap-2"
      >
        <Play className="w-4 h-4" />
        Start Setup Wizard
      </Button>
    </div>
  );
};

export default Startup;