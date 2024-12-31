import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
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
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          });
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error in profile fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">Profile not found</p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-end mb-8">
          <Button variant="default" onClick={() => navigate("/blogs/new")}>
            Create A Blog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;