import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Store, BadgeCheck, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Vendors = () => {
  const navigate = useNavigate();

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
              <Card key={i} className="bg-card animate-pulse h-48">
                <div className="h-full bg-muted rounded-lg" />
              </Card>
            ))
          ) : vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="relative h-48 overflow-hidden group"
              >
                {/* Background Banner with Overlay */}
                <div className="absolute inset-0">
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
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">
                        {vendor.business_name || vendor.profiles?.username}
                      </h3>
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {vendor.business_description || "This vendor hasn't added a description yet."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => navigate(`/vendors/${vendor.id}`)}
                      className="backdrop-blur-sm"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => navigate(`/vendors/${vendor.id}/store`)}
                      className="backdrop-blur-sm"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Visit Store
                    </Button>
                  </div>
                </div>
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
