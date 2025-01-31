import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

const Vendors = () => {
  const navigate = useNavigate();
  const session = useSession();
  console.log('Session details:', session);

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
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  const handleBecomeVendor = () => {
    navigate('/vendors/new');
  };

  const handleVendorNavigation = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-gradient">Marketplace Vendors</h1>
              <p className="text-muted-foreground">
                Discover trusted vendors in our marketplace
              </p>
            </div>
          </div>
        </div>

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
            <p>Loading vendors...</p>
          ) : vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="bg-card hover:bg-card/80 transition-colors cursor-pointer"
                onClick={() => handleVendorNavigation(vendor.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{vendor.business_name || vendor.profiles?.username}</CardTitle>
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>Verified Marketplace Vendor</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {vendor.business_description || "This vendor hasn't added a description yet."}
                  </p>
                  {vendor.social_links && Object.keys(vendor.social_links).length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {Object.entries(vendor.social_links).map(([platform, url]) => (
                        url && (
                          <a
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {platform}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </CardContent>
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
