"use client";

import React from "react";
import BlogForm from "@/components/dashboard/blog/BlogForm";
import { useParams } from "next/navigation";
import { useGetSingleBlogQuery } from "@/redux/api/blog/blogApi";
import { Loader2 } from "lucide-react";

const EditBlogPage = () => {
  const { id } = useParams();
  
  const { data, isLoading } = useGetSingleBlogQuery(id as string, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0061AA]" />
      </div>
    );
  }

  // Handle case where blog isn't found
  if (!data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Blog post not found.</p>
      </div>
    );
  }

  return <BlogForm mode="edit" id={id as string} initialData={data.data} />;
};

export default EditBlogPage;
