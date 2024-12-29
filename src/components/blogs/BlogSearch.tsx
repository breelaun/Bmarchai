import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BlogSearch = ({ searchQuery, setSearchQuery }: BlogSearchProps) => {
  return (
    <div className="relative max-w-xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search blog posts..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default BlogSearch;