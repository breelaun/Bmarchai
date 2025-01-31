import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Edit, RefreshCw, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ProductsListProps {
  products: any[];
  session: Session | null;
  isMobile?: boolean;
  showProducts?: boolean;
  channelId: string | null;
  showSidebar?: boolean;
}

const ProductsList = ({ products, session, isMobile, showProducts, channelId, showSidebar }: ProductsListProps) => {
  const { toast } = useToast();
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchVendorProducts();
    }
  }, [session?.user?.id]);

  const fetchVendorProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', session?.user?.id);

      if (error) throw error;
      setVendorProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching vendor products:', error);
    }
  };

  const handleAddProduct = async (productId: number) => {
    if (!channelId || !session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('chat_channel_products')
        .insert({
          channel_id: channelId,
          product_id: productId,
          added_by: session.user.id,
          is_active: true
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

  const handleRemoveProduct = async (productId: number) => {
    if (!channelId) return;

    try {
      const { error } = await supabase
        .from('chat_channel_products')
        .delete()
        .eq('channel_id', channelId)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product removed from channel",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove product",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (productId: number, currentActive: boolean) => {
    if (!channelId) return;

    try {
      const { error } = await supabase
        .from('chat_channel_products')
        .update({ is_active: !currentActive })
        .eq('channel_id', channelId)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${currentActive ? 'hidden from' : 'shown in'} channel`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product visibility",
        variant: "destructive",
      });
    }
  };

  const syncWithVendorProducts = async () => {
    if (!channelId || !session?.user?.id) return;
    setIsSyncing(true);

    try {
      // Get all vendor products
      const { data: vendorProducts, error: vendorError } = await supabase
        .from('products')
        .select('id')
        .eq('vendor_id', session.user.id);

      if (vendorError) throw vendorError;

      // Add all vendor products that aren't already in the channel
      const productIds = vendorProducts.map(p => p.id);
      const { error: insertError } = await supabase
        .from('chat_channel_products')
        .upsert(
          productIds.map(id => ({
            channel_id: channelId,
            product_id: id,
            added_by: session.user.id,
            is_active: true
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Products synchronized with vendor inventory",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sync products",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!showProducts) return null;

  return (
    <div className={`${isMobile ? (showSidebar ? 'absolute right-0 z-20' : 'hidden') : ''} w-60 bg-[#2B2D31] flex flex-col h-full`}>
      <div className="p-4 border-b border-[#1F2023] shadow">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Products</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={syncWithVendorProducts}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 rounded bg-[#383A40] text-white"
            >
              <div className="flex-1">
                <p className="font-medium">{product.products.name}</p>
                <p className="text-sm text-[#949BA4]">
                  ${product.products.price}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Switch
                  checked={product.is_active}
                  onCheckedChange={() => handleToggleActive(product.products.id, product.is_active)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(product.products.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-2">
            Add Products
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Products to Channel</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {vendorProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 rounded bg-secondary"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.price}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddProduct(product.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsList;