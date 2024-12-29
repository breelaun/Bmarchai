import { ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { id } = useParams();

  // Sample blog post data (will be replaced with real data later)
  const post = {
    id: Number(id),
    title: "Getting Started with Online Business",
    content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
    author: "John Doe",
    date: "2024-03-15",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    tags: ["business", "startup", "entrepreneurship"],
  };

  return (
    <div className="container mx-auto py-8">
      <Link to="/blogs" className="flex items-center text-primary mb-6 hover:text-primary/80">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Link>

      <article className="prose prose-lg max-w-none">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm text-muted-foreground">
              {post.date} · By {post.author}
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        <div className="flex gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="leading-relaxed">{post.content}</div>
      </article>
    </div>
  );
};

export default BlogPost;