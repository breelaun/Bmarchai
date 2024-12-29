import { ArrowLeft, Share2, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    relatedPosts: [
      {
        id: 2,
        title: "Digital Marketing Strategies",
        excerpt: "Discover effective digital marketing strategies for growth.",
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      },
      {
        id: 3,
        title: "E-commerce Success Stories",
        excerpt: "Real-world examples of successful e-commerce businesses.",
        imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
      },
    ],
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    }
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
          <div className="space-y-2">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="text-sm text-muted-foreground">
              {post.date} · By {post.author}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
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

        <div className="leading-relaxed mb-12">{post.content}</div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {post.relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blogs/${relatedPost.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <img
                    src={relatedPost.imageUrl}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{relatedPost.title}</h3>
                    <p className="text-muted-foreground text-sm">{relatedPost.excerpt}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;