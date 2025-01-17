import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({ searchQuery, onSearchChange, onSearch }: SearchBarProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search stocks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
};