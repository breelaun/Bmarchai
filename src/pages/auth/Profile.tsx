import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LogoutButton from "@/components/profile/LogoutButton";
import type { ProfileData } from "@/components/profile/types";

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [session?.user?.id, navigate, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {profile && (
        <>
          <ProfileHeader
            username={profile.username || ""}
            fullName={profile.full_name || ""}
            avatarUrl={profile.avatar_url}
          />
          
          <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-end mb-6">
              <LogoutButton />
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6">
              <ProfileForm initialProfile={profile} userId={session.user.id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;