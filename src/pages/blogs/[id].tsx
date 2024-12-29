import { useParams } from "react-router-dom";
import BlogPostHeader from "@/components/blogs/BlogPostHeader";
import RelatedPosts from "@/components/blogs/RelatedPosts";

const BlogPost = () => {
  const { category, slug } = useParams();

  // Sample data - replace with Supabase fetch based on category and slug
  const post = {
    id: 1,
    title: "Getting Started with Online Business",
    content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
    author: "John Doe",
    date: "2024-03-15",
    category: category || "Business",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    tags: ["business", "startup", "entrepreneurship"],
    slug: slug,
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
      <article className="prose prose-lg max-w-none">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
        
        <BlogPostHeader post={post} onShare={handleShare} />
        
        <div className="leading-relaxed mb-12">{post.content}</div>
        
        <RelatedPosts posts={post.relatedPosts} />
      </article>
    </div>
  );
};

export default BlogPost;