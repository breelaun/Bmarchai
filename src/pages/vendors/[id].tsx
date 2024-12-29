import { useParams } from "react-router-dom";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";

const VendorProfile = () => {
  const { id } = useParams();
  const isNewVendor = id === "new";

  // This would normally come from an API call using the ID
  const mockVendorData = {
    template: "classic",
    displayStyle: "Default Display",
    bentoStyle: "Show Image + Name + Price",
    socialLinks: {
      facebook: "https://facebook.com/vendor",
      instagram: "https://instagram.com/vendor",
      twitter: "https://twitter.com/vendor",
    },
    aboutMe: "Welcome to our store! We specialize in premium fitness equipment and personalized training programs.",
    enableReviews: true,
    enableFeatured: true,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isNewVendor ? (
        <VendorProfileSetup />
      ) : (
        <div className="space-y-8">
          <VendorProfileDisplay vendorData={mockVendorData} />
          <VendorStore vendorId={id} />
        </div>
      )}
    </div>
  );
};

export default VendorProfile;