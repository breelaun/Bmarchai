import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Eye } from "lucide-react";

interface ProfileBlogSectionProps {
  userId: string;
}

const ProfileBlogSection = ({ userId }: ProfileBlogSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const placeholderCategories = Array(5).fill("placeholder");

  // First, fetch the user's profile to get their username
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Then use the username to fetch their blogs
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["profile-blogs", profile?.username, selectedCategory],
    queryFn: async () => {
      if (!profile?.username) return [];
      
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("author", profile.username)
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!profile?.username,
  });

  // Get unique categories from user's blogs
  const activeCategories = blogs
    ? Array.from(new Set(blogs.map((blog) => blog.category)))
    : [];

  // Combine active categories with placeholders
  const displayCategories = [
    ...activeCategories,
    ...placeholderCategories.slice(activeCategories.length),
  ].slice(0, 5);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Categories Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8">
          <h2 className="text-2xl font-bold font-heading">Blog Categories</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {activeCategories.map((category) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.category}/${blog.slug}`}
                className="group hover:opacity-90 transition-all"
              >
                <Card className="overflow-hidden h-full border-border/50 hover:border-primary/50 transition-colors">
                  <div className="aspect-video relative">
                    <img
                      src={blog.image_url || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    >
                      {blog.status}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      {blog.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.reading_time} min read
                        </span>
                      )}
                      {blog.view_count !== null && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {blog.view_count} views
                        </span>
                      )}
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