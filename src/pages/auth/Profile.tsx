import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blogs/BlogCard";
import type { ProfileData } from "@/components/profile/types";
import type { BlogData } from "@/types/blog";

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

  // Fetch blogs directly in the profile page
  const { data: blogs } = useQuery({
    queryKey: ["profile-blogs", profile?.username],
    queryFn: async () => {
      if (!profile?.username) return [];
      
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("author", profile.username)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as BlogData[];
    },
    enabled: !!profile?.username,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {profile && (
        <>
          <ProfileHeader profile={profile} />
          
          <div className="container max-w-3xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Posts</h2>
              <a 
                href="/blogs/new" 
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Post
              </a>
            </div>
            
            <div className="space-y-6">
              {blogs?.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground">
                    Share your thoughts with the world by creating your first post.
                  </p>
                </div>
              ) : (
                blogs?.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;