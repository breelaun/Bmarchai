import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ProfileBlogSectionProps {
  userId: string;
}

const ProfileBlogSection = ({ userId }: ProfileBlogSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const placeholderCategories = Array(5).fill("placeholder");

  console.log("ProfileBlogSection - userId:", userId); // Debug log

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["profile-blogs", userId, selectedCategory],
    queryFn: async () => {
      console.log("Fetching blogs for user:", userId); // Debug log
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("author", userId)
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching blogs:", error); // Debug log
        throw error;
      }
      
      console.log("Fetched blogs:", data); // Debug log
      return data || [];
    },
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
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="w-full bg-[#18181b]">
      <div className="max-w-[calc(100vw-32px)] mx-auto p-8">
        {/* Categories Header */}
        <div className="flex items-center gap-8 mb-8">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div className="flex items-center gap-6">
            {displayCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                {category === "placeholder" ? (
                  <div className="w-20 h-1 bg-gray-600 rounded" />
                ) : (
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`text-lg hover:text-primary transition-colors ${
                      selectedCategory === category ? "underline font-semibold" : ""
                    }`}
                  >
                    {category}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.category}/${blog.slug}`}
                className="hover:opacity-90 transition-opacity"
              >
                <Card className="overflow-hidden">
                  <img
                    src={blog.image_url || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Let's Write Some Blogs!</h3>
            <p className="text-muted-foreground mb-6">
              Share your thoughts and experiences with the world.
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create a Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBlogSection;