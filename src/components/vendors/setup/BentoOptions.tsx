import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const bentoStyles = [
  { id: "grid", name: "Grid Layout", description: "Products displayed in a responsive grid" },
  { id: "masonry", name: "Masonry Layout", description: "Pinterest-style dynamic layout" },
  { id: "list", name: "List Layout", description: "Vertical list with detailed information" },
];

interface BentoOptionsProps {
  selectedBento: string;
  setSelectedBento: (value: string) => void;
}

const BentoOptions = ({ selectedBento, setSelectedBento }: BentoOptionsProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-heading font-semibold">Choose Layout Style</h2>
    <RadioGroup value={selectedBento} onValueChange={setSelectedBento}>
      <div className="grid grid-cols-1 gap-4">
        {bentoStyles.map((style) => (
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

export default BentoOptions;