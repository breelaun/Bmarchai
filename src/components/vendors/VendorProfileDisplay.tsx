import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VendorHeader from "./profile/VendorHeader";
import type { Profile } from "@/types/profile";

interface VendorData {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
}

interface VendorProfileDisplayProps {
  vendorData: VendorData;
  vendorId?: string;
}

const VendorProfileDisplay = ({ vendorData, vendorId }: VendorProfileDisplayProps) => {
  const { socialLinks, aboutMe, enableReviews, enableFeatured } = vendorData;

  // Fetch the user's profile data to get the banner URL
  const { data: profile } = useQuery({
    queryKey: ['profile', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', vendorId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data as Profile;
    },
    enabled: !!vendorId
  });


return (
  <div className="vendor-profile space-y-6">
    <VendorHeader 
      profile={profile} 
      aboutMe={aboutMe}
    />
    
    <div className="container mx-auto px-4">
      <div className="social-links flex gap-4 text-muted-foreground">
        {socialLinks.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Facebook
          </a>
        )}
        {socialLinks.instagram && (
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Instagram
          </a>
        )}
        {socialLinks.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Twitter
          </a>
        )}
      </div>

      {enableReviews && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>
          {enableReviews && <div>Reviews are enabled</div>}
        </div>
      )}

      {enableFeatured && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Featured</h3>
          {enableFeatured && <div>Featured content is enabled</div>}
        </div>
      )}
    </div>
  </div>
);
};

export default VendorProfileDisplay;