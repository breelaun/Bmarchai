import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string | null;
    vendor_id: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCartItems();
    }
  }, [session?.user?.id]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            name,
            price,
            image_url,
            vendor_id
          )
        `)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setItems(data as CartItem[]);
    } catch (error: any) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: session.user.id,
          product_id: productId,
          quantity,
        });

      if (error) throw error;

      fetchCartItems();
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error: any) {
      console.error('Error updating cart item quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      setItems([]);
      toast({
        title: "Success",
        description: "Cart cleared successfully",
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};