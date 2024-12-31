import { useParams } from "react-router-dom";
import VendorProfileSetup from "@/components/vendors/VendorProfileSetup";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";

const VendorProfile = () => {
  const { id } = useParams();
  const [setupStarted, setSetupStarted] = useState(false);
  const isNewVendor = id === "new";

  if (!isNewVendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VendorProfileDisplay vendorData={mockVendorData} />
        <VendorStore vendorId={id} />
      </div>
    );
  }

  if (!setupStarted) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-heading font-bold mb-6 text-center">
          Welcome to Your Vendor Journey
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Let's set up your vendor profile and customize your store. We'll guide you through each step of the process.
        </p>
        <Button 
          size="lg" 
          onClick={() => setSetupStarted(true)}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Start Setup Wizard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VendorProfileSetup />
    </div>
  );
};

// Mock vendor data (you might want to replace this with actual data fetching)
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

export default VendorProfile;