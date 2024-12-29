import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const templates = [
  { id: "classic", name: "Classic Elegance", description: "Timeless and sophisticated design" },
  { id: "bold", name: "Bold & Modern", description: "Contemporary and striking appearance" },
  { id: "minimalist", name: "Minimalist Chic", description: "Clean and simple aesthetics" },
  { id: "vintage", name: "Vintage Vibes", description: "Retro-inspired styling" },
  { id: "playful", name: "Playful Pop", description: "Fun and energetic design" },
  { id: "luxury", name: "Luxury Boutique", description: "High-end and exclusive feel" },
  { id: "sport", name: "Sport & Active", description: "Dynamic and energetic layout" },
  { id: "tech", name: "Tech Modern", description: "Cutting-edge and innovative design" },
  // ... Additional templates can be added here
];

const displayStyles = [
  { id: "default", name: "Default Display", description: "Template-based product grid or list" },
  { id: "thumbnail", name: "Thumbnail & Price", description: "Images and prices side by side" },
  { id: "list", name: "Name & Price Only", description: "Simple list format" },
];

const bentoOptions = [
  { id: "image", name: "Show Image Only" },
  { id: "full", name: "Show Image + Name + Price" },
  { id: "rating", name: "Show Image + Name + Rating" },
  { id: "stock", name: "Show Image + Name + Stock Status" },
];

type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

const VendorProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState<SetupStep>("template");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [selectedBento, setSelectedBento] = useState("");
  const [socialLinks, setSocialLinks] = useState({ facebook: "", instagram: "", twitter: "" });
  const [aboutMe, setAboutMe] = useState("");
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableFeatured, setEnableFeatured] = useState(true);

  const handleNext = () => {
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

  const handleLaunch = () => {
    // This would normally save to a backend
    toast.success("Your vendor profile has been created successfully!");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "template":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Choose Your Template</h2>
            <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={template.id} id={template.id} />
                    <Label htmlFor={template.id} className="font-medium">
                      {template.name}
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "display":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Choose Display Style</h2>
            <RadioGroup value={selectedDisplay} onValueChange={setSelectedDisplay}>
              <div className="grid grid-cols-1 gap-4">
                {displayStyles.map((style) => (
                  <div key={style.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={style.id} id={style.id} />
                    <Label htmlFor={style.id} className="font-medium">
                      {style.name}
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "bento":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Bento Box Display Options</h2>
            <RadioGroup value={selectedBento} onValueChange={setSelectedBento}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bentoOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.name}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "additional":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Additional Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Social Links</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Facebook URL"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  />
                  <Input
                    placeholder="Instagram URL"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  />
                  <Input
                    placeholder="Twitter URL"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">About Me</h3>
                <Textarea
                  placeholder="Tell us about yourself and your store..."
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableReviews}
                    onChange={(e) => setEnableReviews(e.target.checked)}
                  />
                  Enable Reviews Section
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableFeatured}
                    onChange={(e) => setEnableFeatured(e.target.checked)}
                  />
                  Enable Featured Products Section
                </Label>
              </div>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Ready to Launch!</h2>
            <p className="text-muted-foreground">
              Your vendor profile is ready to go. You can always return to your profile settings to make changes anytime.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleLaunch} className="w-full">Launch Your Store</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
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
  );
};

export default VendorProfileSetup;