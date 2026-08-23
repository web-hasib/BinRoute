"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

interface BlogSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewBlog: () => void;
  onAddAnother: () => void;
  message?: string;
}

const BlogSuccessModal: React.FC<BlogSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewBlog,
  onAddAnother,
  message = "Your blog post has been successfully published and is now live on the website."
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-xl p-0">
      <div className="flex flex-col items-center text-center p-8 sm:p-12 py-10 sm:py-16">
        <div className="relative mb-8 sm:mb-10">
          <div className="size-20 sm:size-28 bg-[#22C55E] rounded-full flex items-center justify-center">
            <Check className="size-10 sm:size-14 text-white stroke-[3.5px]" />
          </div>
          <div className="absolute -inset-2 sm:-inset-2.5 border-2 border-[#22C55E]/20 rounded-full" />
          <div className="absolute -inset-4 sm:-inset-5 border-2 border-[#22C55E]/10 rounded-full" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] mb-4">Blog Uploaded Successfully</h2>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 max-w-[85%]">
            {message}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Button
            variant="outline"
            onClick={onViewBlog}
            className="w-full bg-[#E5E7EB] border-transparent text-[#4B5563] py-7 rounded-none font-bold text-sm tracking-wide hover:bg-gray-200"
          >
            View Blog
          </Button>
          <Button
            onClick={onAddAnother}
            className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-7 rounded-none font-bold text-sm tracking-wide"
          >
            Add New Blog
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BlogSuccessModal;
