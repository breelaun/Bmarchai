import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@supabase/auth-helpers-react";
import BlogEditor from "@/components/blogs/BlogEditor";

const CreateBlog = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user?.id) {
      navigate("/login");
    }
  }, [auth?.user, navigate]);

  if (!auth?.user?.id) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogEditor />
    </div>
  );
};

export default CreateBlog;