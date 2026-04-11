"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  MessageSquare,
  BookOpen,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetSingleContactQuery,
  useUpdateContactReadMutation,
} from "@/redux/api/contact/contactApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContactDetailsProps {
  id: string;
}

const ContactUsDetails = ({ id }: ContactDetailsProps) => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetSingleContactQuery(id);
  const [updateRead, { isLoading: isUpdating }] = useUpdateContactReadMutation();

  const contact = data?.data;

  const handleMarkAsRead = async () => {
    if (!contact || contact.isRead) return;
    try {
      await updateRead({ id, isRead: true }).unwrap();
      toast.success("Message marked as read!");
    } catch {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm">Loading message details...</span>
      </div>
    );
  }

  // Error state
  if (isError || !contact) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2f3234] font-semibold text-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Details
        </button>
        <div className="bg-white p-12 border border-gray-100 text-center text-gray-400">
          <p className="text-sm">Failed to load contact message. Please try again.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#2f3234] font-semibold text-xl mb-4 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Details
      </button>

      <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm space-y-10 rounded-none">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-[#2f3234]">
            Message Details
          </h3>
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <span
              className={cn(
                "px-4 py-1.5 text-xs font-bold tracking-tight rounded-none inline-flex items-center gap-1.5",
                contact.isRead
                  ? "bg-green-50 text-[#22C55E]"
                  : "bg-red-50 text-red-500"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  contact.isRead ? "bg-[#22C55E]" : "bg-red-500"
                )}
              />
              {contact.isRead ? "Read" : "Unread"}
            </span>

            {/* Timestamp */}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateTime(contact.createdAt)}
            </span>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Full Name */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#5f6162] flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Full Name
            </label>
            <div className="w-full px-5 py-4 bg-[#F8FAFC] border-none text-sm text-[#1a1a1a] font-medium rounded-none min-h-[52px] flex items-center">
              {contact.name}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#5f6162] flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email Address
            </label>
            <div className="w-full px-5 py-4 bg-[#F8FAFC] border-none text-sm text-[#1a1a1a] font-medium rounded-none min-h-[52px] flex items-center">
              <a
                href={`mailto:${contact.email}`}
                className="text-[#0062AA] hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-semibold text-[#5f6162] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              Subject
            </label>
            <div className="w-full px-5 py-4 bg-[#F8FAFC] border-none text-sm text-[#1a1a1a] font-medium rounded-none min-h-[52px] flex items-center">
              {contact.subject}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-semibold text-[#5f6162] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              Message
            </label>
            <div className="w-full px-5 py-6 bg-[#F8FAFC] border-none text-sm text-[#1a1a1a] font-medium rounded-none min-h-[140px] leading-relaxed whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-[#0062AA] font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </button>

          {contact.isRead ? (
            <div className="flex items-center gap-2 text-[#22C55E] font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Already marked as read
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleMarkAsRead}
              disabled={isUpdating}
              className="h-12 px-8 text-sm font-medium flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Mark As Read
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsDetails;
