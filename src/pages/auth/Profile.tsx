import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BlogCard from "@/components/blogs/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { EditVendorProfileButton } from "@/components/ui/EditVendorProfileButton";
import AddContactButton from "@/components/contacts/AddContactButton";
import type { ProfileData } from "@/components/profile/types";
import type { BlogData } from "@/types/blog";

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: blogs, isLoading: blogsLoading, error: blogsError } = useQuery({
    queryKey: ["profile-blogs", profile?.username],
    queryFn: async () => {
      console.log("Fetching blogs for username:", profile?.username);
      
      if (!profile?.username) {
        console.error("No username available");
        return [];
      }

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("author", profile.username)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        toast({
          title: "Error",
          description: "Failed to load blogs: " + error.message,
          variant: "destructive",
        });
        return [];
      }

      console.log("Fetched blogs:", data);
      return data as BlogData[];
    },
    enabled: !!profile?.username,
  });

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
            description: "Failed to load profile: " + error.message,
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched profile:", data);
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
      <div className="relative z-10 flex justify-end gap-2 px-4 py-2">
        {profile.is_vendor && <EditVendorProfileButton />}
        {session?.user?.id && session.user.id !== profile.id && (
          <AddContactButton userId={profile.id} />
        )}
      </div>
      
      <ProfileHeader profile={profile} />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">My Blogs</h2>
          <Button variant="default" onClick={() => navigate("/blogs/new")}>
            Create A Blog
          </Button>
        </div>

        {blogsError ? (
          <div className="text-center py-12 text-red-500">
            <p>Error loading blogs. Please try again later.</p>
          </div>
        ) : blogsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No Blogs Yet</h3>
            <p className="text-muted-foreground mb-6">
              Share your thoughts and experiences with the world.
            </p>
            <Button onClick={() => navigate("/blogs/new")}>
              Create Your First Blog
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
