import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_vendor: boolean;
}

interface ProfileFormProps {
  initialProfile: ProfileData;
  userId: string;
}

const ProfileForm = ({ initialProfile, userId }: ProfileFormProps) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          is_vendor: profile.is_vendor,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // If user becomes a vendor, create vendor profile
      if (profile.is_vendor) {
        const { error: vendorError } = await supabase
          .from("vendor_profiles")
          .upsert({
            id: userId,
          });

        if (vendorError) throw vendorError;

        // Redirect to vendor setup if they just became a vendor
        navigate("/vendors/new");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, username: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.full_name || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, full_name: e.target.value }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Vendor Account</Label>
          <div className="text-sm text-muted-foreground">
            Enable vendor features for your account
          </div>
        </div>
        <Switch
          checked={profile.is_vendor || false}
          onCheckedChange={(checked) =>
            setProfile((prev) => ({ ...prev, is_vendor: checked }))
          }
        />
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;