import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VendorModeToggleProps {
  isVendor: boolean;
  onToggle: (checked: boolean) => void;
}

const VendorModeToggle = ({ isVendor, onToggle }: VendorModeToggleProps) => {
  const navigate = useNavigate();

  const handleVendorToggle = async (checked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to become a vendor");
        return;
      }

      // Update the user's vendor status in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_vendor: checked })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (checked) {
        // Create vendor profile if it doesn't exist
        const { error: vendorError } = await supabase
          .from('vendor_profiles')
          .insert({ id: user.id })
          .select()
          .single();

        if (vendorError && !vendorError.message.includes('duplicate')) {
          throw vendorError;
        }

        toast.success("Vendor profile created successfully!");
        navigate("/vendors/new");
      }

      onToggle(checked);
    } catch (error) {
      console.error('Error toggling vendor mode:', error);
      toast.error("Failed to update vendor status");
    }
  };

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
          onCheckedChange={handleVendorToggle}
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