import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Package, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProductUploadForm from "./products/ProductUploadForm";
import { sidebarItems } from './VendorSidebar';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  inventory_count: number;
  file_urls: string[] | null;
}

const VendorStore = ({ vendorId }: { vendorId?: string }) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const effectiveVendorId = vendorId || currentUserId;
  const isOwner = currentUserId === effectiveVendorId;
  
  const isValidUUID = effectiveVendorId && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(effectiveVendorId);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["vendorProducts", effectiveVendorId],
    queryFn: async () => {
      if (!isValidUUID) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", effectiveVendorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!isValidUUID,
  });

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category || 'uncategorized').filter(Boolean))];

  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (menuRef.current) {
      const scrollAmount = 200;
      const scrollPosition = direction === 'left' 
        ? menuRef.current.scrollLeft - scrollAmount
        : menuRef.current.scrollLeft + scrollAmount;
      menuRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isValidUUID) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Please save your vendor profile to view your store.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showUploadForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Add New Product</h2>
          <Button variant="outline" onClick={() => setShowUploadForm(false)}>
            Cancel
          </Button>
        </div>
        <ProductUploadForm onSuccess={() => setShowUploadForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          className="pl-10 w-full"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories Menu */}
      <div className="relative">
        <div
          ref={menuRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.length > 0 ? categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="snap-start whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          )) : (
            <p className="text-muted-foreground px-4">No categories yet</p>
          )}
        </div>
      </div>

      {/* Add Product Button (for owners) */}
      {isOwner && (
        <div className="flex justify-end">
          <Button onClick={() => setShowUploadForm(true)}>
            Add Product
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <CardContent className="p-3">
                <div className="aspect-square mb-3 relative overflow-hidden rounded-lg">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.inventory_count === 0 && (
                    <span className="text-xs text-destructive">Out of stock</span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try adjusting your search terms"
              : isOwner 
                ? "Start adding products to your store to see them displayed here."
                : "This vendor hasn't added any products in this category yet."}
          </p>
          {isOwner && !searchQuery && (
            <Button 
              onClick={() => setShowUploadForm(true)}
              variant="outline" 
              className="mt-4"
            >
              Add Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorStore;
