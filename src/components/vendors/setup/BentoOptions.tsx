import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const bentoStyles = [
  {
    id: "grid",
    name: "Grid Layout",
    description: "Products displayed in a clean, organized grid",
    previewUrl: "/lovable-uploads/grid-layout.png"
  },
  {
    id: "masonry",
    name: "Masonry Layout",
    description: "Dynamic, Pinterest-style product layout",
    previewUrl: "/lovable-uploads/masonry-layout.png"
  },
  {
    id: "list",
    name: "List Layout",
    description: "Detailed list view with product information",
    previewUrl: "/lovable-uploads/list-layout.png"
  }
];

interface BentoOptionsProps {
  selectedBento: string;
  setSelectedBento: (style: string) => void;
}

const BentoOptions = ({
  selectedBento,
  setSelectedBento,
}: BentoOptionsProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-heading font-semibold">Choose Layout Style</h2>
    <RadioGroup value={selectedBento} onValueChange={setSelectedBento}>
      <div className="grid grid-cols-1 gap-6">
        {bentoStyles.map((style) => (
          <Card 
            key={style.id} 
            className={`relative cursor-pointer transition-all ${
              selectedBento === style.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedBento(style.id)}
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

export default BentoOptions;