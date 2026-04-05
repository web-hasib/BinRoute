"use client";

import React from "react";
import BlogForm from "@/components/dashboard/blog/BlogForm";
import { useParams } from "next/navigation";

const EditBlogPage = () => {
  const { id } = useParams();
  
  // In a real app, you might fetch data here and pass it to BlogForm
  // For now, it will rely on what's in Redux or just use the id.
  
  return <BlogForm mode="edit" id={id as string} />;
};

export default EditBlogPage;
