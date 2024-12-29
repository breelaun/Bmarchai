import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";  // Add this import

const BlogsPage = () => {
  const sampleBlogs = [
    {
      id: 1,
      title: "Getting Started with Online Business",
      excerpt: "Learn the essential steps to launch your successful online business venture.",
      author: "John Doe",
      date: "2024-03-15",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
    {
      id: 2,
      title: "Digital Marketing Strategies",
      excerpt: "Discover effective digital marketing strategies for your business growth.",
      author: "Jane Smith",
      date: "2024-03-14",
      category: "Marketing",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search blog posts..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{blog.category}</span>
                <span className="text-sm text-muted-foreground">{blog.date}</span>
              </div>
              <CardTitle className="text-xl">{blog.title}</CardTitle>
              <CardDescription>{blog.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">By {blog.author}</span>
                <Link
                  to={`/blogs/${blog.id}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;