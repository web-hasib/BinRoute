import BlogCardAdmin from "@/components/dashboard/blog/BlogCardAdmin"
import { Button } from "@/components/ui/button"
import Container from "@/components/ui/container"
import { PageHeader } from "@/components/ui/PageHeader"
import { PlusIcon, Search } from "lucide-react"
import Link from "next/link"

const blogPosts = [
    {
        id: "1",
        category: "Construction",
        date: "Oct 12, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "2",
        category: "Project Tips",
        date: "Oct 10, 2023",
        readTime: "8 minutes",
        title: "Maximizing Your Dumpster Space",
        excerpt:
            "Effective waste management is more than just throwing things away. It's about strategy...",
        image: "/dummy.png",
    },
    {
        id: "3",
        category: "Recycling",
        date: "Oct 05, 2023",
        readTime: "6 minutes",
        title: "Sustainable Disposal: What Can Be Recycled?",
        excerpt:
            "Discover which materials from your renovation project can be diverted from landfills...",
        image: "/dummy.png",
    },
    {
        id: "4",
        category: "Commercial",
        date: "Sep 28, 2023",
        readTime: "7 minutes",
        title: "Managing Waste for Large Scale Operations",
        excerpt:
            "Commercial waste needs are unique. Here's how to streamline your operations...",
        image: "/dummy.png",
    },
    {
        id: "5",
        category: "Construction",
        date: "Sep 20, 2023",
        readTime: "5 minutes",
        title: "Residential Cleanout Guide",
        excerpt: "The ultimate checklist for your next home decluttering project...",
        image: "/dummy.png",
    },
    {
        id: "6",
        category: "Project Tips",
        date: "Sep 15, 2023",
        readTime: "4 minutes",
        title: "Choosing Between Dumpster Sizes",
        excerpt:
            "A quick guide to help you decide which yard size fits your project best...",
        image: "/dummy.png",
    },
    {
        id: "7",
        category: "Construction",
        date: "Sep 08, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "8",
        category: "Construction",
        date: "Aug 30, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "9",
        category: "Construction",
        date: "Aug 22, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
];
const BlogPage = () => {
  return (
    <Container>
      <PageHeader title="All Blogs" />
      <div className="bg-white border border-gray-100 overflow-hidden">
        {/* Filters and Tabs */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            />
          </div>

          <Link href="/dashboard/blog/add">
            <Button variant={"primary"} className="rounded-none px-12 py-5.5 text-sm font-bold"> <PlusIcon/> Add New Blog</Button>
          </Link>
        </div>  
        <div className="p-6">
            {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {blogPosts.map((post) => (
                        <BlogCardAdmin key={post.id} {...post} />
                    ))}
                </div>
        </div>
      </div>
    </Container>
  )
}

export default BlogPage