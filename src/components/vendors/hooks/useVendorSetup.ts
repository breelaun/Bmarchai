import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SetupStep, VendorSetupState, SocialLinks, VendorProfileInsert } from "../types/vendor-setup";

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
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");

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

      // First check if a vendor profile already exists
      const { data: existingProfile } = await supabase
        .from("vendor_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        // If profile exists, update it instead of creating a new one
        const { error: updateError } = await supabase
          .from("vendor_profiles")
          .update({
            template_id: selectedTemplate,
            customizations: {
              display_style: selectedDisplay,
              bento_style: selectedBento,
            },
            business_description: aboutMe,
            social_links: socialLinks,
            country,
            timezone,
          })
          .eq("id", user.id);

        if (updateError) throw updateError;
        
        toast.success("Your vendor profile has been updated successfully!");
      } else {
        // If no profile exists, create a new one
        const profileData: VendorProfileInsert = {
          id: user.id,
          template_id: selectedTemplate,
          customizations: {
            display_style: selectedDisplay,
            bento_style: selectedBento,
          },
          business_description: aboutMe,
          social_links: socialLinks,
          country,
          timezone,
        };

        const { error: insertError } = await supabase
          .from("vendor_profiles")
          .insert(profileData);

        if (insertError) throw insertError;
        
        toast.success("Your vendor profile has been created successfully!");
      }

      // Also update the is_vendor flag in the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_vendor: true })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile vendor status:", profileError);
      }

      navigate(`/vendors/${user.id}`);
    } catch (error) {
      console.error("Error creating/updating vendor profile:", error);
      toast.error("Failed to save vendor profile. Please try again.");
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
      country,
      timezone,
    },
    setters: {
      setSelectedTemplate,
      setSelectedDisplay,
      setSelectedBento,
      setSocialLinks,
      setAboutMe,
      setEnableReviews,
      setEnableFeatured,
      setCountry,
      setTimezone,
    },
    navigation: {
      handleNext,
      handleBack,
      handleLaunch,
    },
  };
}