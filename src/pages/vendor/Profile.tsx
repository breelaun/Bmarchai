import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VendorProfileForm from "@/components/vendors/profile/VendorProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VendorProfile() {
  const { data: vendorProfile, isLoading } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorProfileForm initialData={vendorProfile} />
        </CardContent>
      </Card>
    </div>
  );
}