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

  const fetchVendorProfile = async () => {
    const userId = isProfileRoute ? session?.user?.id : id;

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
      .from('vendor_profiles')
      .select('*, profiles:vendor_profiles_id_fkey(*)')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  };

  const { 
    data: vendorProfile, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['vendorProfile', id, session?.user?.id],
    queryFn: fetchVendorProfile,
    enabled: !!id && (!isProfileRoute || !!session)
  });

  useEffect(() => {
    if (isProfileRoute && !session) {
      navigate("/auth/login");
    }
  }, [isProfileRoute, session, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Vendor profile not found"
      });
      navigate('/vendors');
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const defaultVendorData = {
    socialLinks: { facebook: "", instagram: "", twitter: "" },
    aboutMe: "Welcome to my vendor profile!",
    enableReviews: true,
    enableFeatured: true
  };

  const vendorData = vendorProfile 
    ? {
        socialLinks: {
          facebook: vendorProfile.social_links?.facebook || "",
          instagram: vendorProfile.social_links?.instagram || "",
          twitter: vendorProfile.social_links?.twitter || ""
        },
        aboutMe: vendorProfile.business_description || defaultVendorData.aboutMe,
        enableReviews: true,
        enableFeatured: true
      }
    : defaultVendorData;

  return (
    <div className="container mx-auto px-4 py-8">
      <VendorProfileDisplay 
        vendorData={vendorData} 
        vendorId={id} 
      />
      <VendorStore vendorId={id} />
    </div>
  );
};

export default VendorProfile;
