import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Channel, ChannelProduct } from '../types';

interface ProductShowcaseProps {
  channel: Channel;
}

const ProductShowcase = ({ channel }: ProductShowcaseProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['channel-products', channel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_channel_products')
        .select(`
          *,
          products (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq('channel_id', channel.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as ChannelProduct[];
    },
    enabled: !!channel.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Featured Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            {product.products?.image_url && (
              <img
                src={product.products.image_url}
                alt={product.products.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <CardTitle className="text-base">{product.products?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {product.products?.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  ${product.products?.price.toFixed(2)}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;