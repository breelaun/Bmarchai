import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import VendorHeader from "./profile/VendorHeader";
import VendorSidebar from "./profile/VendorSidebar";
import VendorStore from "./profile/VendorStore";
import VendorSocial from "./profile/VendorSocial";
import { SocialLinks, VendorProfileData, VendorCustomizations } from "../types/vendor-setup";

interface VendorProfileDisplayProps {
  vendorData?: {
    template: number | null;
    displayStyle: string;
    bentoStyle: string;
    socialLinks: SocialLinks;
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message
        });
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: vendorProfile, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendorProfile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          template:vendor_templates(*)
        `)
        .eq('id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        toast({
          variant: "destructive",
          title: "Error fetching vendor profile",
          description: error.message
        });
        throw error;
      }

      // Type assertion after validating the shape of the data
      const typedData = data as unknown as VendorProfileData;
      return typedData;
    },
    enabled: !!session?.user?.id
  });

  if (profileLoading || vendorLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If no vendor profile exists yet, we'll use default empty values
  const defaultVendorData = {
    template: null,
    displayStyle: "default",
    bentoStyle: "default",
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
    template: vendorProfile.template_id,
    displayStyle: (vendorProfile.customizations as VendorCustomizations)?.display_style || "default",
    bentoStyle: (vendorProfile.customizations as VendorCustomizations)?.bento_style || "default",
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
      
      <div className="container mx-auto mt-8">
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