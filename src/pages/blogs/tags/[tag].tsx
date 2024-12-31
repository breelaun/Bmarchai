import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogCard from "@/components/blogs/BlogCard";
import CategoryFilter from "@/components/blogs/CategoryFilter";
import { BlogPagination } from "@/components/blogs/BlogPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

const BlogTag = () => {
  const { tag } = useParams();
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
      
      const uniqueCategories = [...new Set(data?.map(item => item.category))];
      return uniqueCategories || [];
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs-by-tag", tag, currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("*")
        .contains('tags', [tag])
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
        );
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error } = await query.range(from, to);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ["blogs-count-by-tag", tag, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("id", { count: "exact" })
        .contains('tags', [tag]);

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
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
      <div className="flex items-center gap-2 mb-6">
        <Tag className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Posts tagged with "{tag}"</h1>
      </div>
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
        baseUrl={`/blogs/tags/${tag}`}
      />
    </div>
  );
};

export default BlogTag;