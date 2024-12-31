import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TemplateSelection from "./setup/TemplateSelection";
import DisplayStyleSelection from "./setup/DisplayStyleSelection";
import BentoOptions from "./setup/BentoOptions";
import AdditionalSettings from "./setup/AdditionalSettings";
import Confirmation from "./setup/Confirmation";
import TemplatePreviewPane from "./setup/TemplatePreviewPane";
import { useTemplateData } from "./hooks/useTemplateData";
import { SocialLinks } from "./types/vendor-setup";

const VendorProfileSetup = () => {
  const [setupStarted, setSetupStarted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [displayStyle, setDisplayStyle] = useState("minimal");
  const [bentoStyle, setBentoStyle] = useState("grid");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [aboutMe, setAboutMe] = useState("");
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableFeatured, setEnableFeatured] = useState(true);
  const navigate = useNavigate();

  const { data: templateData } = useTemplateData(selectedTemplate);

  const handleStartSetup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to become a vendor");
        navigate("/login");
        return;
      }

      // First check if vendor profile already exists
      const { data: existingProfile } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        setSetupStarted(true);
        return;
      }

      // Update the user's vendor status in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_vendor: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create vendor profile
      const { error: vendorError } = await supabase
        .from('vendor_profiles')
        .insert({ id: user.id })
        .select()
        .single();

      if (vendorError) throw vendorError;

      toast.success("Vendor profile created successfully!");
      setSetupStarted(true);
    } catch (error) {
      console.error('Error becoming vendor:', error);
      toast.error("Failed to create vendor profile");
    }
  };

  const handleLaunch = () => {
    // Launch logic will be implemented here
    console.log("Launching store...");
  };

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
          onClick={handleStartSetup}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
          <DisplayStyleSelection
            selectedDisplay={displayStyle}
            setSelectedDisplay={setDisplayStyle}
          />
          <BentoOptions
            selectedBento={bentoStyle}
            setSelectedBento={setBentoStyle}
          />
          <AdditionalSettings
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
            enableReviews={enableReviews}
            setEnableReviews={setEnableReviews}
            enableFeatured={enableFeatured}
            setEnableFeatured={setEnableFeatured}
          />
          <Confirmation onLaunch={handleLaunch} />
        </div>
        <div className="sticky top-8">
          {templateData && (
            <TemplatePreviewPane
              templateStyle={templateData.style_config}
              displayStyle={displayStyle}
              bentoStyle={bentoStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileSetup;