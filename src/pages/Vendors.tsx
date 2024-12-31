import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Vendors = () => {
  const navigate = useNavigate();

  const handleBecomeVendor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to become a vendor");
        navigate("/login");
        return;
      }

      // Check if vendor profile already exists
      const { data: existingProfile } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // If profile exists, navigate to startup
        navigate("/vendors/startup");
        return;
      }

      // Update the user's vendor status in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_vendor: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create vendor profile
      const { error: vendorError } = await supabase
        .from('vendor_profiles')
        .insert({ id: user.id })
        .select()
        .single();

      if (vendorError) throw vendorError;

      toast.success("Vendor profile created successfully!");
      navigate("/vendors/startup");
    } catch (error) {
      console.error('Error becoming vendor:', error);
      toast.error("Failed to create vendor profile");
    }
  };

  const mockVendors = [
    { id: 1, name: "Vendor 1", category: "Food" },
    { id: 2, name: "Vendor 2", category: "Clothing" },
  ];

  return (
    <div>
      <h1>Vendors</h1>
      <button onClick={handleBecomeVendor}>Become a Vendor</button>
      <ul>
        {mockVendors.map(vendor => (
          <li key={vendor.id}>
            {vendor.name} - {vendor.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vendors;