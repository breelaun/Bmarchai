import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import VendorHeader from "./profile/VendorHeader";
import VendorSidebar from "./profile/VendorSidebar";
import VendorStore from "./profile/VendorStore";
import VendorSocial from "./profile/VendorSocial";
import type { VendorDisplayData } from "@/components/types/vendor-setup";

interface VendorProfileDisplayProps {
  vendorData: VendorDisplayData;
}

const VendorProfileDisplay = ({ vendorData }: VendorProfileDisplayProps) => {
  const session = useSession();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <VendorHeader 
        aboutMe={vendorData.aboutMe}
      />
      
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