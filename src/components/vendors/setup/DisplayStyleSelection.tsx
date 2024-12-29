import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const displayStyles = [
  { id: "default", name: "Default Display", description: "Template-based product grid or list" },
  { id: "thumbnail", name: "Thumbnail & Price", description: "Images and prices side by side" },
  { id: "list", name: "Name & Price Only", description: "Simple list format" },
];

interface DisplayStyleSelectionProps {
  selectedDisplay: string;
  setSelectedDisplay: (value: string) => void;
}

const DisplayStyleSelection = ({ selectedDisplay, setSelectedDisplay }: DisplayStyleSelectionProps) => (
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