import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VendorProfileForm from '@/components/vendors/profile/VendorProfileForm';
import ProfileBanner from '@/components/profile/ProfileBanner';
import { Loader2 } from 'lucide-react';

export default function EditVendorProfile() {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      if (!session?.user?.id) return;

      try {
        // First ensure vendor profile exists
        const { data: existingProfile } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingProfile) {
          // Create initial vendor profile if it doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from('vendor_profiles')
            .insert([{ id: session.user.id }])
            .select()
            .single();

          if (insertError) throw insertError;
          setVendorProfile(newProfile);
        } else {
          setVendorProfile(existingProfile);
        }

        // Ensure is_vendor flag is set to true
        await supabase
          .from('profiles')
          .update({ is_vendor: true })
          .eq('id', session.user.id);

      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        toast({
          title: "Error",
          description: "Failed to load vendor profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <ProfileBanner 
          defaultBannerUrl={vendorProfile?.banner_data?.url} 
          userId={session?.user?.id}
          isVendor={true}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Vendor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorProfileForm 
            initialData={vendorProfile} 
            onSuccess={() => {
              toast({
                title: "Success",
                description: "Vendor profile updated successfully",
              });
              navigate('/vendor/profile');
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}