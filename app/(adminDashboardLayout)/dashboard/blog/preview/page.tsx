"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useRouter } from "next/navigation";
import BlogPreviewContent from "@/components/dashboard/blog/BlogPreviewContent";
import BlogSuccessModal from "@/components/dashboard/blog/BlogSuccessModal";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { resetDraft } from "@/feature/blog/blogSlice";

const BlogPreviewPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.blog.draft);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = () => {
    // Call API then...
    setShowSuccess(true);
  };

  return (
    <Container>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[#172C41] font-bold text-2xl hover:opacity-80 transition-all"
        >
          <ArrowLeft className="size-6" />
          Preview Blog
        </button>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-[#D1D5DB] text-[#4B5563] px-8 py-5 h-12 text-sm font-bold rounded-none hover:bg-gray-50"
          >
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            className="flex-1 sm:flex-none bg-[#0061AA] hover:bg-[#004e89] text-white px-8 py-5 h-12 text-sm font-bold rounded-none"
          >
            Publish Blog
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <BlogPreviewContent data={draft} />

      <BlogSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onViewBlog={() => router.push("/dashboard/blog")}
        onAddAnother={() => {
          dispatch(resetDraft());
          router.push("/dashboard/blog/add");
        }}
      />
    </Container>
  );
};

export default BlogPreviewPage;
