import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface RelatedPost {
  id: number;
  title: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  slug: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blogs/${post.category}/${post.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <img
                src={post.image_url || '/placeholder.svg'}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;