"use client";

import React, { useState, useCallback } from "react";
import Container from "@/components/ui/container";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { toast } from "sonner";
import {
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  IFaq,
} from "@/redux/api/faq/faqApi";

type View = "list" | "add" | "edit";

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteModal = ({
  faq,
  onConfirm,
  onCancel,
  isLoading,
}: {
  faq: IFaq;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-md p-8 shadow-xl rounded-none space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-[#1A1A1A]">Delete FAQ</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#1A1A1A]">
            &ldquo;{faq.title}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 h-10 rounded-none"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white px-6 h-10 rounded-none border-none flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Form (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const FAQForm = ({
  type,
  initialData,
  onCancel,
  onSuccess,
}: {
  type: "add" | "edit";
  initialData?: IFaq | null;
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      if (type === "edit" && initialData) {
        await updateFaq({ id: initialData.id, title, description }).unwrap();
        toast.success("FAQ updated successfully!");
      } else {
        await createFaq({ title, description }).unwrap();
        toast.success("FAQ created successfully!");
      }
      onSuccess();
    } catch {
      toast.error(
        type === "edit"
          ? "Failed to update FAQ. Please try again."
          : "Failed to create FAQ. Please try again."
      );
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-bold text-[#0A2540] mb-4">
            {type === "add" ? "FAQ Title" : "Edit FAQ Title"}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How long can I keep the dumpster?"
            className="w-full px-5 py-4 bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none transition-all text-[#1A1A1A] h-14"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-[#0A2540] mb-4">
            {type === "add" ? "Description (Answer)" : "Edit Description"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a clear, helpful answer..."
            rows={6}
            className="w-full px-5 py-4 bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none transition-all text-[#1A1A1A] resize-none min-h-[180px]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-[#0061AA] text-[#0061AA] hover:bg-[#0061AA]/5 px-10 h-12 text-base font-bold rounded-none transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0061AA] hover:bg-[#004275] text-white px-10 h-12 text-base font-bold rounded-none border-none transition-colors flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {type === "add" ? "Add This FAQ" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main FAQ Page
// ─────────────────────────────────────────────────────────────────────────────
const FAQPage = () => {
  const [view, setView] = useState<View>("list");
  const [editingFaq, setEditingFaq] = useState<IFaq | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<IFaq | null>(null);
  // null = auto (open first), string = user choice, "" = all closed
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isFetching, refetch } = useGetAllFaqsQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: searchTerm || undefined,
  });

  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / rowsPerPage) : 1;

  // Derive the effective open accordion: if user hasn't picked one yet (null),
  // default to the first FAQ's id. Use "" to represent "all closed".
  const effectiveOpenIndex = openIndex === null ? (faqs[0]?.id ?? "") : openIndex;

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFaq) return;
    try {
      await deleteFaq(deletingFaq.id).unwrap();
      toast.success("FAQ deleted successfully!");
      setDeletingFaq(null);
      setOpenIndex(null);
    } catch {
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  const toggleAccordion = (id: string) => {
    // When closing the active item, use "" so it doesn't re-auto-open the first
    setOpenIndex(effectiveOpenIndex === id ? "" : id);
  };

  // ── Form view ──
  if (view === "add" || view === "edit") {
    return (
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setView("list");
              setEditingFaq(null);
            }}
            className="p-1 hover:bg-gray-200 transition-colors rounded-none"
          >
            <ArrowLeft className="size-6 text-[#1A1A1A]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            {view === "add" ? "Add New FAQ" : "Edit FAQ"}
          </h1>
        </div>

        <FAQForm
          type={view}
          initialData={editingFaq}
          onCancel={() => {
            setView("list");
            setEditingFaq(null);
          }}
          onSuccess={() => {
            setView("list");
            setEditingFaq(null);
          }}
        />
      </Container>
    );
  }

  // ── List view ──
  return (
    <Container>
      {/* Delete Confirm Modal */}
      {deletingFaq && (
        <DeleteModal
          faq={deletingFaq}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingFaq(null)}
          isLoading={isDeleting}
        />
      )}

      <h1 className="text-2xl font-bold text-[#0A2540] mb-6">FAQ List</h1>

      {/* Toolbar */}
      <div className="bg-white p-5 shadow-sm mb-0 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:outline-none focus:border-[#0061AA] transition-all text-sm h-11"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="h-11 px-5 rounded-none"
            >
              Search
            </Button>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="p-2.5 border border-gray-200 text-gray-400 hover:text-[#0062AA] hover:border-[#0062AA] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Button
              onClick={() => {
                setEditingFaq(null);
                setView("add");
              }}
              variant="primary"
              className="rounded-none flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add New FAQ
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="bg-white shadow-sm mb-8">
        {/* Status bar */}
        <div className="px-6 py-3 border-b border-gray-50 flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">
            Total:{" "}
            <span className="text-[#0062AA] font-bold">{meta?.total ?? 0}</span>{" "}
            FAQs
          </span>
          {searchTerm && (
            <span className="ml-2 text-xs text-gray-400">
              — filtered by &ldquo;{searchTerm}&rdquo;
            </span>
          )}
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading FAQs...</span>
          </div>
        )}

        {/* FAQ Accordion */}
        {!isLoading && !isFetching && (
          <div className="divide-y divide-gray-100">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <div key={faq.id} className="transition-all duration-300">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/50 transition-colors group"
                  >
                    <span
                      className={cn(
                        "text-base font-semibold transition-colors pr-4",
                        effectiveOpenIndex === faq.id
                          ? "text-[#0061AA]"
                          : "text-[#1A1A1A]"
                      )}
                    >
                      {faq.title}
                    </span>
                    {effectiveOpenIndex === faq.id ? (
                      <ChevronUp className="size-5 text-[#0061AA] shrink-0" />
                    ) : (
                      <ChevronDown className="size-5 text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] shrink-0" />
                    )}
                  </button>

                  {/* Accordion Body */}
                  {effectiveOpenIndex === faq.id && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-[#666666] leading-relaxed mb-6 max-w-4xl text-sm">
                        {faq.description}
                      </p>
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFaq(faq);
                            setView("edit");
                          }}
                          variant="outline"
                          className="border-[#0061AA] bg-blue-50 text-[#0061AA] hover:bg-[#2070c7] hover:text-white px-5 h-9 text-sm font-semibold flex items-center gap-2 rounded-none transition-all"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingFaq(faq);
                          }}
                          variant="outline"
                          className="border-red-300 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-5 h-9 text-sm font-semibold flex items-center gap-2 rounded-none transition-all"
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                <p className="text-sm">
                  {searchTerm
                    ? `No FAQs found matching "${searchTerm}".`
                    : "No FAQs available. Click \"Add New FAQ\" to get started."}
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-3 text-xs text-[#0061AA] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(page) => setCurrentPage(page)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          className="border-t border-gray-100"
        />
      </div>
    </Container>
  );
};

export default FAQPage;