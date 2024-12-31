import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogData } from "./types";

interface ProfileBlogListProps {
  blogs: BlogData[];
}

const ProfileBlogList = ({ blogs }: ProfileBlogListProps) => {
  console.log("ProfileBlogList render:", { blogsLength: blogs.length, blogs });

  if (!blogs.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-semibold mb-4">No Blogs Yet</h3>
        <p className="text-muted-foreground mb-6">
          Share your thoughts and experiences with the world.
        </p>
        <Link
          to="/blogs/new"
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
        >
          Create Your First Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          to={`/blogs/${blog.category}/${blog.slug}`}
          className="block group"
        >
          <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[4/3]">
              <img
                src={blog.image_url || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg line-clamp-2 mb-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {blog.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProfileBlogList;