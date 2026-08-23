"use client";

import React, { useState } from "react";
import BlogContent from "@/components/sections/BlogContent";
import Container from "@/components/ui/container";
import { ArrowLeft, Edit, Trash, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useGetSingleBlogQuery, useDeleteBlogMutation } from "@/redux/api/blog/blogApi";
import { toast } from "sonner";

const BlogDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { data, isLoading } = useGetSingleBlogQuery(id, { skip: !id });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);

  const blog = data?.data;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    setIsDeletingConfirm(true);
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully!");
      router.push("/dashboard/blog");
    } catch (error) {
      toast.error("Failed to delete blog. Please try again.");
      setIsDeletingConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 text-[#0061AA] animate-spin" />
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-gray-500 font-medium">Blog not found.</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 text-[#0061AA] hover:underline"
          >
            Go Back
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl hover:opacity-80 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Blog Details
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => router.push(`/dashboard/blog/edit/${id}`)}
            className="bg-[#0061AA] border border-[#0061AA] hover:bg-[#012038] hover:text-white transition-all duration-300 flex justify-center gap-2 cursor-pointer ease-in-out text-white px-6 py-2.5 rounded-none font-semibold text-sm"
          >
            <Edit className="size-4" /> Edit Blog
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting || isDeletingConfirm}
            className="bg-[#b935351c] border border-red-400 text-red-500 px-6 py-2.5 rounded-none hover:bg-red-500 hover:text-white transition-all duration-300 flex justify-center gap-2 cursor-pointer ease-in-out font-semibold text-sm disabled:opacity-50"
          >
            {(isDeleting || isDeletingConfirm) ? <Loader2 className="size-4 animate-spin" /> : <Trash className="size-4" />}
            Delete Blog
          </button>
        </div>
      </div>
      <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-100">
        <BlogContent blog={blog} />
      </div>
    </Container>
  );
};

export default BlogDetailsPage;