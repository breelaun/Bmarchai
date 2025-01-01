import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { supabase } from "@/integrations/supabase/client";

const VendorProfile = () => {
  const { id } = useParams();
  const isNewVendor = id === "new";

  const { data: vendorProfile } = useQuery({
    queryKey: ['vendorProfile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          template:vendor_templates(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !isNewVendor && !!id
  });

  const vendorData = {
    template: vendorProfile?.template_id,
    displayStyle: vendorProfile?.customizations?.display_style || "Default Display",
    bentoStyle: vendorProfile?.customizations?.bento_style || "Show Image + Name + Price",
    socialLinks: vendorProfile?.social_links || {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    aboutMe: vendorProfile?.business_description || "",
    enableReviews: true,
    enableFeatured: true,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isNewVendor ? (
        <VendorProfileSetup />
      ) : (
        <div className="space-y-8">
          <VendorProfileDisplay vendorData={vendorData} />
          <VendorStore vendorId={id} />
        </div>
      )}
    </div>
  );
};

export default VendorProfile;