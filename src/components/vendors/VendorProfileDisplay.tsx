import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import VendorHeader from "./profile/VendorHeader";
import AddContactButton from "../contacts/AddContactButton";
import { EditVendorProfileButton } from "../ui/EditVendorProfileButton";
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
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const session = useSession();

  const { data: profile, refetch } = useQuery({
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

  useEffect(() => {
    if (!vendorId || !session?.user?.id) return;
    setIsOwnProfile(session.user.id === vendorId);
  }, [vendorId, session?.user?.id]);

  return (
    <div className="vendor-profile space-y-6">
      {/* Action buttons container - Moved above the banner for proper z-index */}
      {vendorId && (
        <div className="relative z-10 flex justify-end gap-2 px-4 py-2">
          {isOwnProfile && profile?.is_vendor && (
            <EditVendorProfileButton />
          )}
          <AddContactButton targetUserId={vendorId} />
        </div>
      )}

      <div className="relative">
        <VendorHeader 
          profile={profile} 
          aboutMe={aboutMe}
        />
      </div>
      
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