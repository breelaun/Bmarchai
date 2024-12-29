import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const bentoOptions = [
  { id: "image", name: "Show Image Only" },
  { id: "full", name: "Show Image + Name + Price" },
  { id: "rating", name: "Show Image + Name + Rating" },
  { id: "stock", name: "Show Image + Name + Stock Status" },
];

interface BentoOptionsProps {
  selectedBento: string;
  setSelectedBento: (value: string) => void;
}

const BentoOptions = ({ selectedBento, setSelectedBento }: BentoOptionsProps) => (
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

export default BentoOptions;