import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { supabase } from "@/integrations/supabase/client";

const VendorProfile = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isProfileRoute = id === "profile";

  useEffect(() => {
    if (isProfileRoute && !session) {
      navigate("/auth/login");
    }
  }, [isProfileRoute, session, navigate]);

  const { data: vendorProfile, isLoading, error } = useQuery({
    queryKey: ['vendorProfile', id, session?.user?.id],
    queryFn: async () => {
      let userId = id;
      
      if (isProfileRoute) {
        if (!session?.user?.id) {
          throw new Error("No authenticated user found");
        }
        userId = session.user.id;
      }

      // Check if the provided ID is a valid UUID
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
      
      if (!isValidUUID) {
        throw new Error("Invalid vendor ID");
      }

      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles:vendor_profiles_id_fkey(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching vendor profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && (!isProfileRoute || !!session),
    retry: 1  // Limit retry attempts
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Vendor profile not found. Please check the vendor ID."
      });
      navigate('/vendors');
    }
  }, [error, navigate, toast]);

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
    socialLinks: vendorProfile.social_links ? {
      facebook: (vendorProfile.social_links as any)?.facebook || "",
      instagram: (vendorProfile.social_links as any)?.instagram || "",
      twitter: (vendorProfile.social_links as any)?.twitter || "",
    } : defaultVendorData.socialLinks,
    aboutMe: vendorProfile.business_description || defaultVendorData.aboutMe,
    enableReviews: true,
    enableFeatured: true,
  } : defaultVendorData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <VendorProfileDisplay 
          vendorData={vendorData} 
          vendorId={id} 
        />
        <VendorStore vendorId={id} />
      </div>
    </div>
  );
};

export default VendorProfile;
