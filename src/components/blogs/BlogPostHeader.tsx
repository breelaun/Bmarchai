import { Link } from "react-router-dom";
import { ArrowLeft, Share2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPostHeaderProps {
  post: {
    title: string;
    category: string;
    date: string;
    author: string;
    tags: string[];
  };
  onShare: () => void;
}

const BlogPostHeader = ({ post, onShare }: BlogPostHeaderProps) => {
  return (
    <>
      <Link to="/blogs" className="flex items-center text-primary mb-6 hover:text-primary/80">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="text-sm text-muted-foreground">
            {post.date} · By {post.author}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

      <div className="flex gap-2 mb-6">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default BlogPostHeader;