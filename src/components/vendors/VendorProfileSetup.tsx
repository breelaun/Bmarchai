import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemplateSelection from "./setup/TemplateSelection";
import DisplayStyleSelection from "./setup/DisplayStyleSelection";
import BentoOptions from "./setup/BentoOptions";
import AdditionalSettings from "./setup/AdditionalSettings";
import Confirmation from "./setup/Confirmation";
import TemplatePreviewPane from "./setup/TemplatePreviewPane";
import { useVendorSetup } from "./hooks/useVendorSetup";
import { useTemplateData } from "./hooks/useTemplateData";

const VendorProfileSetup = () => {
  const {
    currentStep,
    state,
    setters,
    navigation,
  } = useVendorSetup();

  const { data: templateData } = useTemplateData(state.selectedTemplate);

  const renderStep = () => {
    switch (currentStep) {
      case "template":
        return (
          <TemplateSelection
            selectedTemplate={state.selectedTemplate}
            setSelectedTemplate={setters.setSelectedTemplate}
          />
        );
      case "display":
        return (
          <DisplayStyleSelection
            selectedDisplay={state.selectedDisplay}
            setSelectedDisplay={setters.setSelectedDisplay}
          />
        );
      case "bento":
        return (
          <BentoOptions
            selectedBento={state.selectedBento}
            setSelectedBento={setters.setSelectedBento}
          />
        );
      case "additional":
        return (
          <AdditionalSettings
            socialLinks={state.socialLinks}
            setSocialLinks={setters.setSocialLinks}
            aboutMe={state.aboutMe}
            setAboutMe={setters.setAboutMe}
            enableReviews={state.enableReviews}
            setEnableReviews={setters.setEnableReviews}
            enableFeatured={state.enableFeatured}
            setEnableFeatured={setters.setEnableFeatured}
          />
        );
      case "confirmation":
        return <Confirmation onLaunch={navigation.handleLaunch} />;
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
                  <Button variant="outline" onClick={navigation.handleBack}>
                    Back
                  </Button>
                )}
                {currentStep !== "confirmation" && (
                  <Button onClick={navigation.handleNext} className="ml-auto">
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
              displayStyle={state.selectedDisplay}
              bentoStyle={state.selectedBento}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfileSetup;