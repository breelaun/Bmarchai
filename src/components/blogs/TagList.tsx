import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagListProps {
  tags: string[];
  className?: string;
}

const TagList = ({ tags, className = "" }: TagListProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Tag className="h-4 w-4 text-muted-foreground" />
      {tags.map((tag) => (
        <Link key={tag} to={`/blogs/tags/${tag.toLowerCase()}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default TagList;