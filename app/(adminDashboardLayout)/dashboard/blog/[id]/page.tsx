"use client"
import BlogContent from '@/components/sections/BlogContent'
import Container from '@/components/ui/container'
import { PageHeader } from '@/components/ui/PageHeader'
import { ArrowLeft, Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
const BlogDetailsPage = () => {
const router = useRouter()
    return (
    <Container>
        <div className='flex justify-between items-center'>

         <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
          >
          <ArrowLeft className="w-5 h-5" />
          Blog Details
        </button>
        <div className='flex justify-center items-center gap-4'>
            <button className='bg-[#0061AA] border border-[#0061AA] hover:bg-[#012038] hover:text-white transition-all duration-300 flex justify-center gap-2 cursor-pointer ease-in-out text-white px-4 py-2 rounded-none'><Edit/> Edit Blog</button>
            <button className='bg-[#b935351c] border border-red-400 text-red-400 px-4 py-2 rounded-none hover:bg-red-400 hover:text-white transition-all duration-300 flex justify-center gap-2 cursor-pointer ease-in-out'><Trash/> Delete Blog</button>
        </div>
            </div>
        <BlogContent/></Container>
  )
}

export default BlogDetailsPage