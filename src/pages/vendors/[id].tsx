import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { supabase } from "@/integrations/supabase/client";

interface VendorProfileData {
  template_id: number | null;
  customizations: {
    display_style?: string;
    bento_style?: string;
  } | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  } | null;
  business_description: string | null;
}

const VendorProfile = () => {
  const { id } = useParams();
  const isNewVendor = id === "new";

  const { data: vendorProfile } = useQuery({
    queryKey: ['vendorProfile', id],
    queryFn: async () => {
      if (!id || isNewVendor) return null;
      
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          template:vendor_templates(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      // Type assertion after validation
      if (data) {
        const customizations = data.customizations as { display_style?: string; bento_style?: string; } | null;
        const socialLinks = data.social_links as { facebook?: string; instagram?: string; twitter?: string; } | null;
        
        return {
          template_id: data.template_id,
          customizations,
          social_links: socialLinks,
          business_description: data.business_description
        } as VendorProfileData;
      }
      
      return null;
    },
    enabled: !isNewVendor && !!id
  });

  const vendorData = vendorProfile ? {
    template: vendorProfile.template_id,
    displayStyle: vendorProfile.customizations?.display_style || "Default Display",
    bentoStyle: vendorProfile.customizations?.bento_style || "Show Image + Name + Price",
    socialLinks: vendorProfile.social_links || {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    aboutMe: vendorProfile.business_description || "",
    enableReviews: true,
    enableFeatured: true,
  } : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {isNewVendor ? (
        <VendorProfileSetup />
      ) : vendorData ? (
        <div className="space-y-8">
          <VendorProfileDisplay vendorData={vendorData} />
          <VendorStore vendorId={id} />
        </div>
      ) : null}
    </div>
  );
};

export default VendorProfile;