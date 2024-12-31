import { useState } from "react";
import { useProfileBlogs } from "./blog/useProfileBlogs";
import ProfileBlogFilter from "./blog/ProfileBlogFilter";
import ProfileBlogList from "./blog/ProfileBlogList";

interface ProfileBlogSectionProps {
  userId: string;
}

const ProfileBlogSection = ({ userId }: ProfileBlogSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { blogs, isLoading } = useProfileBlogs(userId, selectedCategory);

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Get unique categories from user's blogs
  const categories = blogs ? Array.from(new Set(blogs.map((blog) => blog.category))) : [];

  return (
    <div className="w-full bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <ProfileBlogFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ProfileBlogList blogs={blogs || []} />
      </div>
    </div>
  );
};

export default ProfileBlogSection;