import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const displayStyles = [
  { 
    id: "minimal", 
    name: "Minimal", 
    description: "Clean, simple product display",
    previewUrl: "/lovable-uploads/minimal-display.png"
  },
  { 
    id: "detailed", 
    name: "Detailed", 
    description: "Comprehensive product information",
    previewUrl: "/lovable-uploads/detailed-display.png"
  },
  { 
    id: "compact", 
    name: "Compact", 
    description: "Space-efficient product display",
    previewUrl: "/lovable-uploads/compact-display.png"
  },
];

interface DisplayStyleSelectionProps {
  selectedDisplay: string;
  setSelectedDisplay: (style: string) => void;
}

const DisplayStyleSelection = ({
  selectedDisplay,
  setSelectedDisplay,
}: DisplayStyleSelectionProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-heading font-semibold">Choose Display Style</h2>
    <RadioGroup value={selectedDisplay} onValueChange={setSelectedDisplay}>
      <div className="grid grid-cols-1 gap-6">
        {displayStyles.map((style) => (
          <Card 
            key={style.id} 
            className={`relative cursor-pointer transition-all ${
              selectedDisplay === style.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedDisplay(style.id)}
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={style.id} id={style.id} />
                    <Label htmlFor={style.id} className="font-medium">
                      {style.name}
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </Label>
                  </div>
                </div>
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                  <img
                    src={style.previewUrl}
                    alt={`${style.name} preview`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RadioGroup>
  </div>
);

export default DisplayStyleSelection;