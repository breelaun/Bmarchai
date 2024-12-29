import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogCard from "@/components/blogs/BlogCard";
import CategoryFilter from "@/components/blogs/CategoryFilter";
import BlogPagination from "@/components/blogs/BlogPagination";
import { Skeleton } from "@/components/ui/skeleton";

const BlogsPage = () => {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blogs")
        .select('category');
      
      // Get unique categories
      const uniqueCategories = [...new Set(data?.map(item => item.category))];
      return uniqueCategories || [];
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error } = await query.range(from, to);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ["blogs-count", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("id", { count: "exact" });

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      const { count } = await query;
      return count || 0;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <BlogHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <BlogHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {categories && <CategoryFilter categories={categories} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs?.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/blogs"
      />
    </div>
  );
};

export default BlogsPage;
