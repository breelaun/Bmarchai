import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogData } from "./types";

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
      if (!profile?.username) {
        console.log("No username found, skipping blog fetch");
        return [];
      }
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
      
      // Ensure the status is one of the allowed values
      const typedBlogs: BlogData[] = (data || []).map(blog => ({
        ...blog,
        status: blog.status as 'draft' | 'published' | 'scheduled'
      }));
      
      console.log("Fetched blogs:", typedBlogs);
      return typedBlogs;
    },
    enabled: !!profile?.username,
  });

  return {
    blogs,
    isLoading: isProfileLoading || isBlogsLoading,
  };
};