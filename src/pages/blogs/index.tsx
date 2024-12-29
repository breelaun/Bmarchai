import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Book } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const sampleBlogs = [
    {
      id: 1,
      title: "Getting Started with Online Business",
      excerpt: "Learn the essential steps to launch your successful online business venture.",
      author: "John Doe",
      date: "2024-03-15",
      category: "Business",
      tags: ["startup", "entrepreneurship", "guide"],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
    {
      id: 2,
      title: "Digital Marketing Strategies",
      excerpt: "Discover effective digital marketing strategies for your business growth.",
      author: "Jane Smith",
      date: "2024-03-14",
      category: "Marketing",
      tags: ["marketing", "digital", "growth"],
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
    {
      id: 3,
      title: "E-commerce Success Stories",
      excerpt: "Real-world examples of successful e-commerce businesses and their strategies.",
      author: "Mike Johnson",
      date: "2024-03-13",
      category: "E-commerce",
      tags: ["success", "case-study", "retail"],
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
    },
  ];

  const filteredBlogs = sampleBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-bold">Blog Posts</h1>
        </div>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary">{blog.category}</Badge>
                <span className="text-sm text-muted-foreground">{blog.date}</span>
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
                    to={`/blogs/${blog.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;