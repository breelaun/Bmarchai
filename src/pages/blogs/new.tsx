import BlogEditor from "@/components/blogs/BlogEditor";

const CreateBlog = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogEditor />
    </div>
  );
};

export default CreateBlog;