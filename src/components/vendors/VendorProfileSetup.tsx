import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import TemplateSelection from "./setup/TemplateSelection";
import DisplayStyleSelection from "./setup/DisplayStyleSelection";
import BentoOptions from "./setup/BentoOptions";
import AdditionalSettings from "./setup/AdditionalSettings";
import Confirmation from "./setup/Confirmation";
import TemplatePreviewPane from "./setup/TemplatePreviewPane";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

const VendorProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [selectedBento, setSelectedBento] = useState("");
  const [socialLinks, setSocialLinks] = useState({ facebook: "", instagram: "", twitter: "" });
  const [aboutMe, setAboutMe] = useState("");
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableFeatured, setEnableFeatured] = useState(true);

  const { data: templateData } = useQuery({
    queryKey: ["vendorTemplate", selectedTemplate],
    queryFn: async () => {
      if (!selectedTemplate) return null;
      const { data, error } = await supabase
        .from("vendor_templates")
        .select("*")
        .eq("id", selectedTemplate)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTemplate,
  });

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

      const { error: profileError } = await supabase
        .from("vendor_profiles")
        .insert({
          id: user.id,
          template_id: selectedTemplate,
          customizations: {
            display_style: selectedDisplay,
            bento_style: selectedBento,
          },
          business_description: aboutMe,
          social_links: socialLinks,
        });

      if (profileError) throw profileError;

      toast.success("Your vendor profile has been created successfully!");
      navigate(`/vendors/${user.id}`);
    } catch (error) {
      console.error("Error creating vendor profile:", error);
      toast.error("Failed to create vendor profile. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "template":
        return (
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        );
      case "display":
        return (
          <DisplayStyleSelection
            selectedDisplay={selectedDisplay}
            setSelectedDisplay={setSelectedDisplay}
          />
        );
      case "bento":
        return (
          <BentoOptions
            selectedBento={selectedBento}
            setSelectedBento={setSelectedBento}
          />
        );
      case "additional":
        return (
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
        );
      case "confirmation":
        return <Confirmation onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Profile Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderStep()}
              <div className="flex justify-between mt-6">
                {currentStep !== "template" && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep !== "confirmation" && (
                  <Button onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {templateData && (
          <div className="sticky top-20">
            <TemplatePreviewPane
              templateStyle={templateData.style_config}
              displayStyle={selectedDisplay}
              bentoStyle={selectedBento}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfileSetup;