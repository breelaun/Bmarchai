import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentButtonProps {
  amount: number;
  vendorId?: string;
  className?: string;
}

const PaymentButton = ({ amount, vendorId, className }: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!vendorId) {
      toast({
        title: "Error",
        description: "Vendor information is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (paymentMethod === "cash") {
        // Handle cash payment
        toast({
          title: "Cash Payment Selected",
          description: "Please pay in cash when receiving your items.",
        });
        return;
      }

      const response = await fetch(
        "https://qyblzbqpyasfoirqzdpo.functions.supabase.co/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            vendorId,
            paymentMethod,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as "card" | "cash")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="card">Pay by Card</SelectItem>
          <SelectItem value="cash">Pay by Cash</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className={className}
        id="payment-button"
        name="payment-button"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${amount.toFixed(2)} USD`
        )}
      </Button>
    </div>
  );
};

export default PaymentButton;