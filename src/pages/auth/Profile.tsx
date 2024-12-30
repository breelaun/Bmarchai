import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !session?.user?.id) return;

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          is_vendor: profile.is_vendor,
        })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      // If user becomes a vendor, create vendor profile
      if (profile.is_vendor) {
        const { error: vendorError } = await supabase
          .from("vendor_profiles")
          .upsert({
            id: session.user.id,
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile?.username || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, username: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profile?.full_name || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, full_name: e.target.value }))
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
              checked={profile?.is_vendor || false}
              onCheckedChange={(checked) =>
                setProfile((prev) => ({ ...prev!, is_vendor: checked }))
              }
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;