import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cartItems", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products (
            name,
            price,
            image_url
          )
        `)
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!session?.user?.id,
  });

  const addToCart = async (productId: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", session.user.id)
        .eq("product_id", productId)
        .single();

      if (existingItem) {
        // If item exists, increment quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("user_id", session.user.id)
          .eq("product_id", productId);

        if (error) throw error;
      } else {
        // If item doesn't exist, insert new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: session.user.id,
            product_id: productId,
            quantity: 1,
          });

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", productId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!session?.user?.id) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", session.user.id)
        .eq("product_id", productId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider value={{ items, isLoading, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};