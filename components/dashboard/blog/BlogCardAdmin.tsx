"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteBlogMutation } from "@/redux/api/blog/blogApi";
import { toast } from "sonner";

interface BlogCardProps {
    id: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    image: string;
}

const BlogCardAdmin: React.FC<BlogCardProps> = ({
    id,
    category,
    date,
    readTime,
    title,
    excerpt,
    image,
}) => {
    const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        
        setIsDeleting(true);
        try {
            await deleteBlog(id).unwrap();
            toast.success("Blog deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete blog. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative">
            {/* Image with Category Badge */}
            <div className="relative aspect-video w-full overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover" />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#0061AA] uppercase tracking-wider">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {readTime}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-[#0A2540] line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

               <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Link href={`/dashboard/blog/${id}`}>
                    <Button variant={"outline"} className="px-3 h-9 text-xs font-bold border-[#0061AA] text-[#0061AA] hover:bg-blue-50 rounded-none">
                        View
                    </Button>
                </Link>
                <Link href={`/dashboard/blog/edit/${id}`}>
                  <Button variant="outline" className="px-3 h-9 text-xs font-bold border-[#0061AA] bg-[#0061AA] text-white hover:bg-[#004e89] hover:text-white rounded-none transition-all">
                      Edit
                  </Button>
                </Link>
                <Button 
                    variant="outline" 
                    onClick={handleDelete}
                    disabled={isLoading || isDeleting}
                    className="px-3 h-9 text-xs font-bold border-red-500 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-none transition-all"
                >
                    {(isLoading || isDeleting) ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </Button>
               </div>
            </div>
        </div>
    );
};

export default BlogCardAdmin;
