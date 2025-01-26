import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="vendor-profile">
      <h2 className="text-2xl font-bold">{vendorId}</h2>
      <p>{aboutMe}</p>
      <div className="social-links">
        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
      {enableReviews && <div>Reviews are enabled</div>}
      {enableFeatured && <div>Featured content is enabled</div>}
    </div>
  );
};

export default VendorProfileDisplay;
