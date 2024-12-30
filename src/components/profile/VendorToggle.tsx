import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VendorToggleProps {
  isVendor: boolean;
  onToggle: (checked: boolean) => void;
}

const VendorToggle = ({ isVendor, onToggle }: VendorToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Vendor Account</Label>
        <div className="text-sm text-muted-foreground">
          Enable vendor features for your account
        </div>
      </div>
      <Switch
        checked={isVendor}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default VendorToggle;