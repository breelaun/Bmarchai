import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const displayStyles = [
  { id: "minimal", name: "Minimal", description: "Clean, simple product display" },
  { id: "detailed", name: "Detailed", description: "Comprehensive product information" },
  { id: "compact", name: "Compact", description: "Space-efficient product display" },
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

export default DisplayStyleSelection;