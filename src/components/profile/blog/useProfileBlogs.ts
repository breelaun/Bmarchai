import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileBlogs = (userId: string, selectedCategory: string | null) => {
  // First, fetch the user's profile to get their username
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      console.log("Fetched profile:", data);
      return data;
    },
  });

  // Then use the username to fetch their blogs
  const { data: blogs, isLoading: isBlogsLoading } = useQuery({
    queryKey: ["profile-blogs", profile?.username, selectedCategory],
    queryFn: async () => {
      if (!profile?.username) return [];
      console.log("Fetching blogs for username:", profile.username);
      
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("author", profile.username);

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      
      console.log("Fetched blogs:", data);
      return data || [];
    },
    enabled: !!profile?.username,
  });

  return {
    blogs,
    isLoading: isProfileLoading || isBlogsLoading,
  };
};