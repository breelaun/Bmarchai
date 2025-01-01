import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
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
  const session = useSession();
  const navigate = useNavigate();
  const isNewVendor = id === "new";
  const isProfileRoute = id === "profile";

  useEffect(() => {
    if (isProfileRoute && !session) {
      navigate("/auth/login");
    }
  }, [isProfileRoute, session, navigate]);

  const { data: vendorProfile, isLoading } = useQuery({
    queryKey: ['vendorProfile', id, session?.user?.id],
    queryFn: async () => {
      if (!id || isNewVendor) return null;
      
      let userId = id;
      
      if (isProfileRoute) {
        if (!session?.user?.id) {
          throw new Error("No authenticated user found");
        }
        userId = session.user.id;
      }

      console.log("Fetching vendor profile for userId:", userId);

      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          template:vendor_templates(*)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching vendor profile:", error);
        throw error;
      }

      console.log("Vendor profile data:", data);
      return data as VendorProfileData;
    },
    enabled: !isNewVendor && !!id && (!isProfileRoute || !!session)
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  if (isProfileRoute && !session) {
    return null;
  }

  // If we're on the profile route and there's no vendor profile, show the setup
  if (isProfileRoute && !vendorProfile) {
    console.log("No vendor profile found, showing setup");
    return (
      <div className="container mx-auto px-4 py-8">
        <VendorProfileSetup />
      </div>
    );
  }

  const vendorData = vendorProfile ? {
    template: vendorProfile.template_id,
    displayStyle: vendorProfile.customizations?.display_style || "Default Display",
    bentoStyle: vendorProfile.customizations?.bento_style || "Show Image + Name + Price",
    socialLinks: {
      facebook: vendorProfile.social_links?.facebook || "",
      instagram: vendorProfile.social_links?.instagram || "",
      twitter: vendorProfile.social_links?.twitter || "",
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
      ) : (
        <VendorProfileSetup />
      )}
    </div>
  );
};

export default VendorProfile;