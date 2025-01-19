import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
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
}

const VendorProfileDisplay = ({ vendorData }: VendorProfileDisplayProps) => {
  const session = useSession();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error fetching profile",
            description: error.message
          });
          throw error;
        }
        return data;
      } catch (error: any) {
        console.error('Error in profile query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile data"
        });
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1
  });

  const { data: vendorProfile, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendorProfile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching vendor profile:', error);
          toast({
            variant: "destructive",
            title: "Error fetching vendor profile",
            description: error.message
          });
          throw error;
        }

        // Type assertion to ensure social_links matches expected structure
        const typedData = data ? {
          ...data,
          social_links: data.social_links as VendorProfileData['social_links']
        } : null;

        return typedData as VendorProfileData;
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
    enabled: !!session?.user?.id,
    retry: 1
  });

  if (profileLoading || vendorLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const defaultVendorData = {
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: ""
    },
    aboutMe: "",
    enableReviews: false,
    enableFeatured: false
  };

  const currentVendorData = vendorProfile ? {
    socialLinks: vendorProfile.social_links || defaultVendorData.socialLinks,
    aboutMe: vendorProfile.business_description || "",
    enableReviews: true,
    enableFeatured: true
  } : defaultVendorData;

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader 
        profile={profile} 
        aboutMe={currentVendorData.aboutMe}
      />
      
      <div className="container mx-auto mt-10"> {/* Added margin top to create a 5px gap */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <VendorSidebar />
          </div>
          
          <div className="col-span-9 space-y-6">
            <VendorStore />
            <VendorSocial socialLinks={currentVendorData.socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDisplay;
