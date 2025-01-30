import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductsListProps {
  products: any[];
  session: Session | null;
  isMobile?: boolean;
  showProducts?: boolean;
  channelId: string | null;
}

const ProductsList = ({ products, session, isMobile, showProducts, channelId }: ProductsListProps) => {
  const { toast } = useToast();

  const handleAddProduct = async (productId: number) => {
    if (!channelId || !session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('chat_channel_products')
        .insert({
          channel_id: channelId,
          product_id: productId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added to channel",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  if (!showProducts) return null;

  return (
    <div className={`${isMobile ? 'absolute right-0 z-20' : ''} w-60 bg-[#2B2D31] flex flex-col h-full`}>
      <div className="p-4 border-b border-[#1F2023] shadow">
        <h2 className="font-semibold text-white">Products</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 rounded bg-[#383A40] text-white"
            >
              <div>
                <p className="font-medium">{product.products.name}</p>
                <p className="text-sm text-[#949BA4]">
                  ${product.products.price}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddProduct(product.products.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsList;