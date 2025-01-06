import { Input } from "@/components/ui/input";

export const ClientSearchBar = () => {
  return (
    <div className="flex items-center px-2">
      <Input
        placeholder="Search contacts..."
        className="max-w-sm"
      />
    </div>
  );
};