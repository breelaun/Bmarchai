import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorStore from "@/components/vendors/VendorStore";

const VendorProfile = () => {
  const { id } = useParams();
  const isSetupMode = true; // This would normally come from a state management system

  return (
    <div className="container mx-auto px-4 py-8">
      {isSetupMode ? (
        <VendorProfileSetup />
      ) : (
        <VendorStore vendorId={id} />
      )}
    </div>
  );
};

export default VendorProfile;