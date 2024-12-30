import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileData } from "./types";

export const useProfileUpdate = (
  userId: string, 
  initialProfile: ProfileData,
  onSuccess?: () => void
) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
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

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      onSuccess?.();
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