import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_vendor: boolean;
  date_of_birth: string;
  country?: string;
  gender?: 'Male' | 'Female' | null;
  phone_number?: string;
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
    
    if (!profile.username || !profile.full_name || !profile.date_of_birth) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          is_vendor: profile.is_vendor,
          date_of_birth: profile.date_of_birth,
          country: profile.country,
          gender: profile.gender,
          phone_number: profile.phone_number,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      if (profile.is_vendor) {
        const { error: vendorError } = await supabase
          .from("vendor_profiles")
          .upsert({
            id: userId,
          });

        if (vendorError) throw vendorError;
        navigate("/vendors/new");
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Only redirect to profile if not becoming a vendor
      navigate("/profile");
      
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
        <Label htmlFor="username">
          Username <span className="text-red-500">*</span>
        </Label>
        <Input
          id="username"
          value={profile.username || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          value={profile.full_name || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, full_name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={profile.date_of_birth || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, date_of_birth: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={profile.country || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, country: e.target.value }))
          }
          placeholder="Enter your country"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={profile.gender || ""}
          onValueChange={(value) =>
            setProfile((prev) => ({ ...prev, gender: value as 'Male' | 'Female' | null }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={profile.phone_number || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, phone_number: e.target.value }))
          }
          placeholder="Enter your phone number"
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