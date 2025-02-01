import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
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
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

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
        // Create order for cash payment
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            vendor_id: vendorId,
            payment_method: 'cash',
            payment_status: 'pending',
            order_status: 'pending',
            total_amount: amount,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_time: item.product.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Clear cart and redirect to orders page
        await clearCart();
        toast({
          title: "Order Created",
          description: "Your cash payment order has been created successfully.",
        });
        navigate("/auth/orders");
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