import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "./types";

export const useProfileUpdate = (userId: string, initialProfile: ProfileData) => {
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

      navigate("/profile");
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { profile, setProfile, handleUpdateProfile };
};