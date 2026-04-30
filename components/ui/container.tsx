import React from 'react'
import { cn } from "@/lib/utils";

const Container = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('mx-auto space-y-8 p-4 md:p-6 bg-[#F6F6F6]', className)} {...props}>
      {children}
    </div>
  )
}

export default Container
