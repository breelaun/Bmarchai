import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SetupStep, VendorSetupState, SocialLinks } from "../types/vendor-setup";

export function useVendorSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [selectedBento, setSelectedBento] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ facebook: "", instagram: "", twitter: "" });
  const [aboutMe, setAboutMe] = useState("");
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableFeatured, setEnableFeatured] = useState(true);

  const handleNext = () => {
    if (currentStep === "template" && !selectedTemplate) {
      toast.error("Please select a template to continue");
      return;
    }

    const steps: SetupStep[] = ["template", "display", "bento", "additional", "confirmation"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: SetupStep[] = ["template", "display", "bento", "additional", "confirmation"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleLaunch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to create a vendor profile");
        return;
      }

      const profileData = {
        id: user.id,
        template_id: selectedTemplate,
        customizations: {
          display_style: selectedDisplay,
          bento_style: selectedBento,
        },
        business_description: aboutMe,
        social_links: socialLinks,
      };

      const { error: profileError } = await supabase
        .from("vendor_profiles")
        .insert(profileData);

      if (profileError) throw profileError;

      toast.success("Your vendor profile has been created successfully!");
      navigate(`/vendors/${user.id}`);
    } catch (error) {
      console.error("Error creating vendor profile:", error);
      toast.error("Failed to create vendor profile. Please try again.");
    }
  };

  return {
    currentStep,
    state: {
      selectedTemplate,
      selectedDisplay,
      selectedBento,
      socialLinks,
      aboutMe,
      enableReviews,
      enableFeatured,
    },
    setters: {
      setSelectedTemplate,
      setSelectedDisplay,
      setSelectedBento,
      setSocialLinks,
      setAboutMe,
      setEnableReviews,
      setEnableFeatured,
    },
    navigation: {
      handleNext,
      handleBack,
      handleLaunch,
    },
  };
}