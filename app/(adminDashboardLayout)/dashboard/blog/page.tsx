"use client";

import BlogCardAdmin from "@/components/dashboard/blog/BlogCardAdmin";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlusIcon, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { format } from "date-fns";

const BlogPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isFetching } = useGetAllBlogsQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: searchTerm || undefined,
  });

  const blogs = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPage || 1;

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Container>
      <PageHeader title="All Blogs" />
      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
        {/* Filters and Tabs */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="px-6 h-[44px] rounded-none shadow-none text-sm font-bold"
            >
              Search
            </Button>
          </div>

          <Link href="/dashboard/blog/add">
            <Button
              variant={"primary"}
              className="rounded-none px-10 py-5.5 text-sm font-bold shadow-none"
            >
              <PlusIcon className="mr-2" /> Add New Blog
            </Button>
          </Link>
        </div>

        <div className="p-6">
          {(isLoading || isFetching) ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Loading blogs...</span>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogs.map((post) => (
                <BlogCardAdmin
                  key={post.id}
                  id={post.id}
                  category={post.category}
                  date={format(new Date(post.createdAt), "MMM dd, yyyy")}
                  readTime={`${post.readingTime} minutes`}
                  title={post.title}
                  excerpt={post.shortDescription}
                  image={post.thumbnail || post.coverPhoto || "/dummy.png"}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-gray-500">
              No blogs found.
            </div>
          )}
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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

export default BlogPage;