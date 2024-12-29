import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogCard from "@/components/blogs/BlogCard";
import CategoryFilter from "@/components/blogs/CategoryFilter";
import BlogPagination from "@/components/blogs/BlogPagination";

const BlogCategory = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - replace with Supabase fetch
  const categories = ["Business", "Marketing", "Technology", "Design"];
  const itemsPerPage = 6;
  
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
    {
      id: 4,
      title: "The Future of Technology",
      excerpt: "Exploring the latest trends in technology and innovation.",
      author: "Alice Brown",
      date: "2024-03-12",
      category: "Technology",
      tags: ["tech", "innovation", "future"],
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
    {
      id: 5,
      title: "Designing for User Experience",
      excerpt: "Best practices for creating user-friendly designs.",
      author: "Chris Green",
      date: "2024-03-11",
      category: "Design",
      tags: ["design", "ux", "user-experience"],
      imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    },
    {
      id: 6,
      title: "Marketing in the Digital Age",
      excerpt: "How to effectively market your business online.",
      author: "Emma White",
      date: "2024-03-10",
      category: "Marketing",
      tags: ["marketing", "digital", "strategy"],
      imageUrl: "https://images.unsplash.com/photo-1512002021952-1c1c1c1c1c1c",
    },
  ].filter(blog => 
    blog.category.toLowerCase() === category?.toLowerCase() &&
    (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(sampleBlogs.length / itemsPerPage);
  const paginatedBlogs = sampleBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-8">
      <BlogHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilter categories={categories} selectedCategory={category} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/blogs/category/${category}`}
      />
    </div>
  );
};

export default BlogCategory;
