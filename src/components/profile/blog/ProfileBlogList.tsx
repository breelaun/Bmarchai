import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpen, Eye } from "lucide-react";
import type { BlogData } from "./types";

interface ProfileBlogListProps {
  blogs: BlogData[];
}

const ProfileBlogList = ({ blogs }: ProfileBlogListProps) => {
  if (!blogs.length) {
    return (
      <div className="text-center py-8">
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          to={`/blogs/${blog.category}/${blog.slug}`}
          className="block hover:opacity-90 transition-all"
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <div className="relative aspect-video">
              <img
                src={blog.image_url || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                variant={blog.status === 'published' ? 'default' : 'secondary'}
              >
                {blog.status}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-medium line-clamp-2 mb-2">
                {blog.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
                {blog.reading_time && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {blog.reading_time} min
                  </div>
                )}
                {blog.view_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {blog.view_count}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProfileBlogList;