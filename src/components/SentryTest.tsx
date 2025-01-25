import React from 'react';
import { useToast } from "@/components/ui/use-toast";

const SentryTest: React.FC = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Sentry Test",
      description: "This would normally throw an error, but we've disabled it for now.",
    });
    // Comment out the error throwing for now
    // throw new Error("This is your first error!");
  };

  return (
    <button 
      onClick={handleClick}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Test Error Handling
    </button>
  );
};

export default SentryTest;