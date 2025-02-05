import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import AddContactButton from "@/components/contacts/AddContactButton";
import { VendorData } from "@/components/types/vendor-setup";

interface VendorProfileDisplayProps {
  vendorId: string;
  vendorData?: VendorData;
}

const VendorProfileDisplay = ({ vendorId, vendorData }: VendorProfileDisplayProps) => {
  const session = useSession();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // If vendorId is "profile", use the current user's ID
        const targetId = vendorId === "profile" ? session?.user?.id : vendorId;
        
        if (!targetId) {
          console.error("No valid vendor ID available");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("id", targetId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching vendor:", error);
        } else {
          setVendor(data);
        }
      } catch (error) {
        console.error("Error in vendor fetch:", error);
      }
      setLoading(false);
    };

    fetchVendor();
  }, [vendorId, session?.user?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return <div>Vendor not found</div>;
  }

  return (
    <div>
      <h1>{vendor.business_name}</h1>
      <p>{vendor.business_description}</p>
      {session?.user?.id && session.user.id !== vendorId && (
        <AddContactButton userId={vendorId} />
      )}
    </div>
  );
};

export default VendorProfileDisplay;