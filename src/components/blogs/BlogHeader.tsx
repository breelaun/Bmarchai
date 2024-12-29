import { Book } from "lucide-react";
import BlogSearch from "./BlogSearch";

interface BlogHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BlogHeader = ({ searchQuery, setSearchQuery }: BlogHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-4xl font-bold">Blog Posts</h1>
      </div>
      <BlogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

export default BlogHeader;