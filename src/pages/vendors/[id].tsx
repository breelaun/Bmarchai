import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { supabase } from "@/integrations/supabase/client";

const VendorProfile = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const isProfileRoute = id === "profile";

  useEffect(() => {
    if (isProfileRoute && !session) {
      navigate("/auth/login");
    }
  }, [isProfileRoute, session, navigate]);

  const { data: vendorProfile, isLoading } = useQuery({
    queryKey: ['vendorProfile', id, session?.user?.id],
    queryFn: async () => {
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
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching vendor profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && (!isProfileRoute || !!session)
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  if (isProfileRoute && !session) {
    return null;
  }

  const defaultVendorData = {
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    aboutMe: "Welcome to my vendor profile!",
    enableReviews: true,
    enableFeatured: true,
  };

  const vendorData = vendorProfile ? {
    socialLinks: vendorProfile.social_links || defaultVendorData.socialLinks,
    aboutMe: vendorProfile.business_description || defaultVendorData.aboutMe,
    enableReviews: true,
    enableFeatured: true,
  } : defaultVendorData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <VendorProfileDisplay vendorData={vendorData} />
        <VendorStore vendorId={id} />
      </div>
    </div>
  );
};

export default VendorProfile;