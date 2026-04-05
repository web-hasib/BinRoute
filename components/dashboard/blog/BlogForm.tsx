"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useRouter } from "next/navigation";
import CustomEditor from "@/components/editor/custom_editor";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateDraft, setTags as setDraftTags, resetDraft } from "@/feature/blog/blogSlice";
import BlogSuccessModal from "./BlogSuccessModal";

interface BlogDraft {
  title: string;
  readingTime: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverPhoto: string | null;
  thumbnail: string | null;
}

interface BlogFormProps {
  mode: "add" | "edit";
  id?: string;
  initialData?: Partial<BlogDraft>;
}

const BlogForm: React.FC<BlogFormProps> = ({ mode, id, initialData }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.blog.draft);
  
  const [tagInput, setTagInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      dispatch(updateDraft(initialData));
    }
    if (id) {
        console.log("Editing blog with ID:", id);
    }
  }, [mode, initialData, dispatch, id]);

  const handleUpdateField = <T extends keyof BlogDraft>(field: T, value: BlogDraft[T]) => {
    dispatch(updateDraft({ [field]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      dispatch(setDraftTags([...draft.tags, tagInput.trim()]));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    dispatch(setDraftTags(draft.tags.filter((_, i) => i !== index)));
  };

  const handlePublish = () => {
    // Here usually call an API
    setShowSuccess(true);
  };

  return (
    <Container>
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[#172C41] font-bold text-2xl hover:opacity-80 transition-all"
        >
          <ArrowLeft className="size-6" />
          {mode === "edit" ? "Edit Blog" : "Add New Blog"}
        </button>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-[#D1D5DB] text-[#4B5563] px-8 py-5 h-12 text-sm font-bold rounded-none hover:bg-gray-50"
          >
            Save Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/blog/preview")}
            className="flex-1 sm:flex-none border-[#D1D5DB] text-[#4B5563] px-8 py-5 h-12 text-sm font-bold rounded-none hover:bg-gray-50"
          >
            Preview
          </Button>
          <Button
            onClick={handlePublish}
            className="w-full sm:w-auto bg-[#0061AA] hover:bg-[#004e89] text-white px-8 py-5 h-12 text-sm font-bold rounded-none"
          >
            {mode === "edit" ? "Update Blog" : "Publish Blog"}
          </Button>
        </div>
      </div>

      {/* Form Body */}
      <div className="space-y-8 pb-16">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0A2540]">Blog Title</label>
          <input
            type="text"
            placeholder="e.g., The Future of Industrial Recycling 2024"
            value={draft.title}
            onChange={(e) => handleUpdateField("title", e.target.value)}
            className="w-full p-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
          />
        </div>

        {/* Time and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Reading Time (mins)</label>
            <input
              type="number"
              placeholder="3"
              value={draft.readingTime}
              onChange={(e) => handleUpdateField("readingTime", e.target.value)}
              className="w-full p-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Category</label>
            <div className="relative">
              <select
                value={draft.category}
                onChange={(e) => handleUpdateField("category", e.target.value)}
                className="w-full p-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0061AA] outline-none text-sm appearance-none"
              >
                <option value="">Select category</option>
                <option value="Construction">Construction</option>
                <option value="Recycling">Recycling</option>
                <option value="Commercial">Commercial</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0A2540]">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {draft.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#166534] text-xs font-bold rounded-none border border-[#BBF7D0]">
                #{tag}
                <X className="size-3 cursor-pointer" onClick={() => removeTag(i)} />
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add tag.."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full p-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
          />
        </div>

        {/* Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#0A2540]">Cover Photo</label>
            <div className="border-2 border-dashed border-[#E5E7EB] p-8 md:p-12 flex flex-col items-center justify-center bg-white min-h-[200px]">
              <Upload className="size-10 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Drag & Drop your cover image<br />
                here or <span className="text-[#0061AA] font-bold cursor-pointer">Click to browse</span>
              </p>
            </div>
            <p className="text-[10px] text-gray-400">Recommended size: 818 x 345px</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#0A2540]">Thumbnail</label>
            <div className="border-2 border-dashed border-[#E5E7EB] p-8 md:p-12 flex flex-col items-center justify-center bg-white min-h-[200px]">
              <Upload className="size-10 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Drag & Drop your cover image<br />
                here or <span className="text-[#0061AA] font-bold cursor-pointer">Click to browse</span>
              </p>
            </div>
            <p className="text-[10px] text-gray-400">Recommended size: 379 x 197px</p>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0A2540]">Short Description / Excerpt</label>
          <textarea
            placeholder="A brief summary of the post for social sharing and previews.."
            rows={3}
            value={draft.excerpt}
            onChange={(e) => handleUpdateField("excerpt", e.target.value)}
            className="w-full p-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0061AA] outline-none text-sm resize-none"
          />
        </div>

        {/* CKEditor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0A2540]">Full Blog Content</label>
          <div className="bg-white overflow-hidden">
            <CustomEditor 
              onDataChange={(data) => handleUpdateField("content", data)}
              title={draft.content}
            />
          </div>
        </div>
      </div>
      <BlogSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onViewBlog={() => router.push("/dashboard/blog")}
        onAddAnother={() => {
          setShowSuccess(false);
          dispatch(resetDraft());
          if (mode === "edit") {
            router.push("/dashboard/blog/add");
          }
        }}
        message={mode === "edit" ? "Your blog post has been successfully updated." : undefined}
      />
    </Container>
  );
};

export default BlogForm;
