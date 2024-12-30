import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";

interface ProfileBlogSectionProps {
  userId: string;
}

const ProfileBlogSection = ({ userId }: ProfileBlogSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = ["Food", "Health", "Lifestyle", "Drama", "Sports"];

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["profile-blogs", userId, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("author", userId)
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data } = await query;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  return (
    <div className="relative mt-8 bg-black min-h-[600px]">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'url("/lovable-uploads/67d729c2-9968-4cb4-aedf-0ff47b786560.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 px-16 py-12">
        <div className="flex">
          {/* Left Side - Categories */}
          <div className="flex flex-col items-start space-y-8 w-64">
            <h2 className="text-2xl font-bold text-white mb-8">Categories</h2>
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="group flex items-center space-x-4 text-white"
              >
                <span className={`text-lg transition-colors ${
                  selectedCategory === category ? "underline font-semibold" : ""
                }`}>
                  {category}
                </span>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "text-white border border-white/20"
                  }`}
                >
                  {index + 1}
                </span>
              </button>
            ))}

            {/* Social Media Links */}
            <div className="flex flex-col space-y-6 mt-12">
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Side - Blog Grid */}
          <div className="flex-1 pl-12">
            {blogs && blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.category}/${blog.slug}`}
                    className="hover:opacity-90 transition-opacity"
                  >
                    <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-0">
                      <img
                        src={blog.image_url || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 text-white">{blog.title}</h3>
                        <p className="text-sm text-white/70 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4 text-white">Let's Write Some Blogs!</h3>
                <p className="text-white/70 mb-6">
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
      </div>
    </div>
  );
};

export default ProfileBlogSection;