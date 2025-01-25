import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import VendorHeader from "./profile/VendorHeader";
import VendorSidebar from "./profile/VendorSidebar";
import VendorStore from "./profile/VendorStore";
import VendorSocial from "./profile/VendorSocial";
import type { VendorProfileData } from "../types/vendor-setup";

interface VendorProfileDisplayProps {
  vendorData?: {
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
    aboutMe: string;
    enableReviews: boolean;
    enableFeatured: boolean;
  };
  vendorId?: string;
}

const VendorProfileDisplay = ({ vendorData, vendorId }: VendorProfileDisplayProps) => {
  const { toast } = useToast();

  const { data: vendorProfile, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendorProfile', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      
      try {
        const { data, error } = await supabase
          .from('vendor_profiles')
          .select('*, profiles:vendor_profiles_id_fkey(*)')
          .eq('id', vendorId)
          .single();
        
        if (error) {
          console.error('Error fetching vendor profile:', error);
          toast({
            variant: "destructive",
            title: "Error fetching vendor profile",
            description: error.message
          });
          throw error;
        }

        return data;
      } catch (error: any) {
        console.error('Error in vendor profile query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch vendor profile data"
        });
        throw error;
      }
    },
    enabled: !!vendorId,
  });

  if (vendorLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!vendorProfile) {
    return <div>Vendor not found</div>;
  }

  const currentVendorData = {
    socialLinks: vendorProfile.social_links || {
      facebook: "",
      instagram: "",
      twitter: ""
    },
    aboutMe: vendorProfile.business_description || "",
    enableReviews: true,
    enableFeatured: true
  };

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader 
        profile={vendorProfile.profiles} 
        aboutMe={currentVendorData.aboutMe}
      />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <VendorSidebar />
          </div>
          
          <div className="md:col-span-9 space-y-6">
            <VendorStore vendorId={vendorId} />
            <VendorSocial socialLinks={currentVendorData.socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDisplay;
