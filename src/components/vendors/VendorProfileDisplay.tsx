import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AddContactButton from "@/components/contacts/AddContactButton";
import { VendorData } from "@/components/types/vendor-setup";

interface VendorProfileDisplayProps {
  vendorId: string;
  vendorData?: VendorData;
}

const VendorProfileDisplay = ({ vendorId, vendorData }: VendorProfileDisplayProps) => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("id", vendorId)
        .single();

      if (error) {
        console.error("Error fetching vendor:", error);
      } else {
        setVendor(data);
      }
      setLoading(false);
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return <div>Vendor not found</div>;
  }

  return (
    <div>
      <h1>{vendor.business_name}</h1>
      <p>{vendor.description}</p>
      <AddContactButton userId={vendorId} />
    </div>
  );
};

export default VendorProfileDisplay;