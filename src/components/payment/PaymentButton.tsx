import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentButtonProps {
  amount: number;
  vendorId: string;
  className?: string;
}

const PaymentButton = ({ amount, vendorId, className }: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { amount, vendorId },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
    </Button>
  );
};

export default PaymentButton;