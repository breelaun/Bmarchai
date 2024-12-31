import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const FilterSidebar = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) => {
  const { data: categories } = useQuery({
    queryKey: ["productCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);
      
      if (error) throw error;
      
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category))
      ).filter(Boolean) as string[];
      
      return uniqueCategories;
    },
  });

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#f7bd00]/20">
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-3">
            {categories?.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                  className="border-[#f7bd00]/50 data-[state=checked]:bg-[#f7bd00] data-[state=checked]:text-black"
                />
                <Label
                  htmlFor={category}
                  className="ml-2 text-gray-300 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={[priceRange[0], priceRange[1]]}
              min={0}
              max={1000}
              step={10}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              className="[&_[role=slider]]:bg-[#f7bd00]"
            />
            <div className="flex justify-between text-sm text-gray-300">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;