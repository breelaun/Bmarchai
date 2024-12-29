import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    created_at: string;
    category: string;
    tags: string[];
    image_url: string | null;
    slug: string;
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <img
        src={blog.image_url || '/placeholder.svg'}
        alt={blog.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{blog.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-xl">{blog.title}</CardTitle>
        <CardDescription>{blog.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">By {blog.author}</span>
            <Link
              to={`/blogs/${blog.category}/${blog.slug}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Read More →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;