import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogPostHeader from "@/components/blogs/BlogPostHeader";
import RelatedPosts from "@/components/blogs/RelatedPosts";
import TagList from "@/components/blogs/TagList";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { category, slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", category, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("category", category)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-blogs", category, slug],
    enabled: !!post,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, excerpt, image_url, category, slug")
        .eq("category", category)
        .neq("slug", slug)
        .limit(2);

      if (error) throw error;
      return data;
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-6">
        <Link to="/blogs/new">
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>
      
      <article className="prose prose-lg max-w-none">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
        )}
        
        <BlogPostHeader post={post} onShare={handleShare} />
        
        <div className="leading-relaxed mb-12">{post.content}</div>
        
        <TagList tags={post.tags || []} className="mb-8" />
        
        {relatedPosts && <RelatedPosts posts={relatedPosts} />}
      </article>
    </div>
  );
};

export default BlogPost;