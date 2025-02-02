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
      console.error("Missing vendorId");
      toast({
        title: "Error",
        description: "Vendor information is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      console.log("Current user ID:", user.id);
      console.log("Vendor ID:", vendorId);

      if (paymentMethod === "cash") {
        // Create order for cash payment
        const orderData = {
          user_id: user.id,
          vendor_id: vendorId,
          payment_method: 'cash',
          payment_status: 'pending',
          status: 'pending', // Match the column name in your orders table
          order_status: 'pending',
          total_amount: amount,
        };
        
        console.log("Creating order with data:", orderData);
        
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          console.error("Order creation error:", orderError);
          throw orderError;
        }

        console.log("Created order:", order);

        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_time: item.product.price,
        }));

        console.log("Creating order items:", orderItems);

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error("Order items creation error:", itemsError);
          throw itemsError;
        }

        // Clear cart and redirect to orders page
        await clearCart();
        toast({
          title: "Order Created",
          description: "Your cash payment order has been created successfully.",
        });
        navigate("/orders");
        return;
      }

      // Card payment
      console.log("Initiating card payment for amount:", amount);
      const response = await fetch(
        "https://qyblzbqpyasfoirqzdpo.functions.supabase.co/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            amount,
            vendorId,
            paymentMethod,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment API error:", errorText);
        throw new Error(`Payment initiation failed: ${errorText}`);
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
