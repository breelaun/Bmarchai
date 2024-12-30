import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProfileForm from "@/components/profile/ProfileForm";
import LogoutButton from "@/components/profile/LogoutButton";

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_vendor: boolean;
}

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
    <div className="container max-w-2xl mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <LogoutButton />
        </div>

        {profile && session?.user?.id && (
          <ProfileForm initialProfile={profile} userId={session.user.id} />
        )}
      </div>
    </div>
  );
};

export default Profile;