import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
      console.log('Initiating payment:', { amount, vendorId });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          amount, 
          vendorId,
          mode: 'payment',
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        },
      });

      if (error) {
        console.error('Payment function error:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('Invalid response:', data);
        throw new Error('No checkout URL received');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again later.",
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
      aria-label="Process payment"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </span>
      ) : (
        `Pay $${amount.toFixed(2)}`
      )}
    </Button>
  );
};

export default PaymentButton;