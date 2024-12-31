import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface ProfileBlogSectionProps {
  userId: string;
}

const ProfileBlogSection = ({ userId }: ProfileBlogSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // First, fetch the user's profile to get their username
  const { data: profile } = useQuery({
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
  const { data: blogs, isLoading } = useQuery({
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

  // Get unique categories from user's blogs
  const categories = blogs ? Array.from(new Set(blogs.map((blog) => blog.category))) : [];

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Categories Filter */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.category}/${blog.slug}`}
                className="block hover:opacity-90 transition-all"
              >
                <Card className="h-full">
                  <div className="relative aspect-video">
                    <img
                      src={blog.image_url || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <Badge 
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    >
                      {blog.status}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No Blogs Yet</h3>
            <p className="text-muted-foreground mb-6">
              Share your thoughts and experiences with the world.
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBlogSection;