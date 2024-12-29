import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const templates = [
  { id: "classic", name: "Classic Elegance", description: "Timeless and sophisticated design" },
  { id: "bold", name: "Bold & Modern", description: "Contemporary and striking appearance" },
  { id: "minimalist", name: "Minimalist Chic", description: "Clean and simple aesthetics" },
  { id: "vintage", name: "Vintage Vibes", description: "Retro-inspired styling" },
  { id: "playful", name: "Playful Pop", description: "Fun and energetic design" },
  { id: "luxury", name: "Luxury Boutique", description: "High-end and exclusive feel" },
  { id: "sport", name: "Sport & Active", description: "Dynamic and energetic layout" },
  { id: "tech", name: "Tech Modern", description: "Cutting-edge and innovative design" },
];

interface TemplateSelectionProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
}

const TemplateSelection = ({ selectedTemplate, setSelectedTemplate }: TemplateSelectionProps) => (
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

export default TemplateSelection;