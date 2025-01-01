import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import VendorHeader from "./profile/VendorHeader";
import VendorSidebar from "./profile/VendorSidebar";
import VendorStore from "./profile/VendorStore";
import VendorSocial from "./profile/VendorSocial";

interface VendorProfileDisplayProps {
  vendorData: {
    template: number | null;
    displayStyle: string;
    bentoStyle: string;
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
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader profile={profile} aboutMe={vendorData.aboutMe} />
      
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <VendorSidebar />
          </div>
          
          <div className="col-span-9 space-y-6">
            <VendorStore />
            <VendorSocial socialLinks={vendorData.socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDisplay;