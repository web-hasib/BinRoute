import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn('mx-auto space-y-8 p-4 md:p-6 bg-[#F6F6F6] animate-in fade-in slide-in-from-left-4 duration-700', className)}>
      {children}
    </div>
  )
}

export default Container