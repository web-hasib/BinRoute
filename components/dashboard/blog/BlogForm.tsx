"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useRouter } from "next/navigation";
import EditorClient from "@/components/editor/EditorClient";
import BlogSuccessModal from "./BlogSuccessModal";
import { useCreateBlogMutation, useUpdateBlogMutation, IBlog } from "@/redux/api/blog/blogApi";
import { toast } from "sonner";

interface BlogFormProps {
  mode: "add" | "edit";
  id?: string;
  initialData?: IBlog | null;
}

const BlogForm: React.FC<BlogFormProps> = ({ mode, id, initialData }) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setReadingTime(initialData.readingTime.toString());
      setCategory(initialData.category);
      setExcerpt(initialData.shortDescription);
      setContent(initialData.fullContent);
      setTags(initialData.tags || []);
      setCoverPhotoPreview(initialData.coverPhoto);
      setThumbnailPreview(initialData.thumbnail);
    }
  }, [mode, initialData]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'thumbnail') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      if (type === 'cover') {
        setCoverPhotoFile(file);
        setCoverPhotoPreview(previewUrl);
      } else {
        setThumbnailFile(file);
        setThumbnailPreview(previewUrl);
      }
    }
  };

  const handlePublish = async () => {
    if (!title || !readingTime || !category || !excerpt || !content) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payloadData = {
      title,
      readingTime: parseInt(readingTime, 10),
      category,
      shortDescription: excerpt,
      fullContent: content,
      tags
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payloadData));

    if (coverPhotoFile) {
      formData.append("coverPhoto", coverPhotoFile);
    }
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      if (mode === "add") {
        await createBlog(formData).unwrap();
        setShowSuccess(true);
      } else if (mode === "edit" && id) {
        await updateBlog({ id, data: formData }).unwrap();
        setShowSuccess(true);
      }
    } catch (error: unknown) {
      const err = error as any;
      toast.error(err?.data?.message || "Something went wrong.");
    }
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
            onClick={handlePublish}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#0061AA] hover:bg-[#004e89] text-white px-8 py-5 h-12 text-sm font-bold rounded-none flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-[#F8FAFC] border border-gray-100 focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
          />
        </div>

        {/* Time and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Reading Time (mins)</label>
            <input
              type="number"
              placeholder="e.g., 5"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              className="w-full p-4 bg-[#F8FAFC] border border-gray-100 focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-[#F8FAFC] border border-gray-100 focus:ring-1 focus:ring-[#0061AA] outline-none text-sm appearance-none"
              >
                <option value="">Select category</option>
                <option value="Construction">Construction</option>
                <option value="Recycling">Recycling</option>
                <option value="Commercial">Commercial</option>
                <option value="Project Tips">Project Tips</option>
                <option value="Other">Other</option>
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
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#166534] text-xs font-bold rounded-none border border-[#BBF7D0]">
                #{tag}
                <X className="size-3 cursor-pointer" onClick={() => removeTag(i)} />
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add tag and press Enter.."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full p-4 bg-[#F8FAFC] border border-gray-100 focus:ring-1 focus:ring-[#0061AA] outline-none text-sm"
          />
        </div>

        {/* Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#0A2540]">Cover Photo</label>
            <div className="relative border-2 border-dashed border-[#E5E7EB] p-8 md:p-12 flex flex-col items-center justify-center bg-[#F8FAFC] min-h-[200px] overflow-hidden">
              {coverPhotoPreview ? (
                <>
                  <img src={coverPhotoPreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-10 p-2 bg-white/80 rounded-md">
                    <span className="text-[#0061AA] font-bold text-sm cursor-pointer">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="size-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 text-center">
                    Drag & Drop your cover image<br />
                    here or <span className="text-[#0061AA] font-bold cursor-pointer">Click to browse</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'cover')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-gray-400">Recommended size: 818 x 345px</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[#0A2540]">Thumbnail</label>
            <div className="relative border-2 border-dashed border-[#E5E7EB] p-8 md:p-12 flex flex-col items-center justify-center bg-[#F8FAFC] min-h-[200px] overflow-hidden">
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-10 p-2 bg-white/80 rounded-md">
                    <span className="text-[#0061AA] font-bold text-sm cursor-pointer">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="size-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 text-center">
                    Drag & Drop your thumbnail image<br />
                    here or <span className="text-[#0061AA] font-bold cursor-pointer">Click to browse</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-4 bg-[#F8FAFC] border border-gray-100 focus:ring-1 focus:ring-[#0061AA] outline-none text-sm resize-none"
          />
        </div>

        {/* CKEditor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0A2540]">Full Blog Content</label>
          <div className="bg-white overflow-hidden border border-gray-100">
            <EditorClient
              key={initialData?.id || "new-blog"}
              onDataChange={(data) => setContent(data)}
              initialData={initialData?.fullContent || ""}
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
          setTitle("");
          setReadingTime("");
          setCategory("");
          setExcerpt("");
          setContent("");
          setTags([]);
          setCoverPhotoFile(null);
          setCoverPhotoPreview(null);
          setThumbnailFile(null);
          setThumbnailPreview(null);
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
