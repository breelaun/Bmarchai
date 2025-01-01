import { useParams } from "react-router-dom";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorShop from "@/components/vendors/shop/VendorShop";

const VendorProfile = () => {
  const { id } = useParams();
  const isNewVendor = id === "new";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Profile</h1>
      {isNewVendor ? (
        <VendorProfileSetup />
      ) : (
        <VendorShop />
      )}
    </div>
  );
};

export default VendorProfile;