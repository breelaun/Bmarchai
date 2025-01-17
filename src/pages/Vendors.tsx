import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Store, BadgeCheck, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Vendors = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles:vendor_profiles_id_fkey (
            username,
            avatar_url
          ),
          products:products (
            id,
            name,
            price,
            main_image_url
          )
        `)
        .limit(3, { foreignTable: 'products' });

      if (error) throw error;
      return data;
    }
  });

  const handleBecomeVendor = () => {
    navigate('/vendors/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-heading font-bold text-gradient">Marketplace Vendors</h1>
          <p className="text-muted-foreground">
            Discover trusted vendors in our marketplace
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search vendors..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" onClick={handleBecomeVendor}>
            Become a Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mt-2" />
                  <div className="h-4 bg-muted rounded w-5/6 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="group relative bg-card overflow-hidden transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredCard(vendor.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Banner Image with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  {vendor.banner_data?.url ? (
                    vendor.banner_data.type === 'video' ? (
                      <video
                        src={vendor.banner_data.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={vendor.banner_data.url}
                        alt={vendor.business_name}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                      <Store className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                {/* Content that slides up on hover */}
                <div className={`absolute inset-0 bg-background/98 transition-transform duration-300 ease-in-out ${hoveredCard === vendor.id ? 'translate-y-0' : 'translate-y-full'}`}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Featured Products</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {vendor.products?.slice(0, 4).map((product: any) => (
                        <div key={product.id} className="relative group/product cursor-pointer">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={product.main_image_url || '/placeholder-product.png'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover/product:scale-110 transition-transform"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-end p-2">
                            <div className="w-full bg-background/80 backdrop-blur-sm p-2 rounded">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-primary">${product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/vendors/${vendor.id}/store`)}
                    >
                      View All Products
                    </Button>
                  </div>
                </div>

                {/* Main Card Content */}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{vendor.business_name || vendor.profiles?.username}</CardTitle>
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>Verified Marketplace Vendor</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {vendor.business_description || "This vendor hasn't added a description yet."}
                  </p>
                  {vendor.social_links && Object.keys(vendor.social_links).length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {Object.entries(vendor.social_links).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {platform}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate(`/vendors/${vendor.id}/store`)}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No vendors found. Be the first to join our marketplace!</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={handleBecomeVendor}
              >
                Become a Vendor
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
