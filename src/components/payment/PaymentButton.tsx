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
      console.log('Initiating payment for amount:', amount, 'to vendor:', vendorId);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          amount, 
          vendorId,
          mode: 'payment' // Specify one-time payment mode
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received from payment service');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again later.",
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
      id="payment-button"
      name="payment-button"
    >
      {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
    </Button>
  );
};

export default PaymentButton;