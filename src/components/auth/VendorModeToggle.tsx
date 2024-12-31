import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VendorModeToggleProps {
  isVendor: boolean;
  onToggle: (checked: boolean) => void;
}

const VendorModeToggle = ({ isVendor, onToggle }: VendorModeToggleProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-2">
        <Label 
          htmlFor="vendor-mode" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Register as a Vendor
        </Label>
        <Switch
          id="vendor-mode"
          checked={isVendor}
          onCheckedChange={onToggle}
        />
      </div>
      
      {isVendor && (
        <div className="text-sm text-muted-foreground">
          You will be redirected to set up your vendor profile after registration.
        </div>
      )}
    </div>
  );
};

export default VendorModeToggle;