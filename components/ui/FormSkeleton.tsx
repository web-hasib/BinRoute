import { Skeleton } from "@/components/ui/skeleton"

interface FormSkeletonProps {
  fields?: number
}

export const FormSkeleton = ({ fields = 5 }: FormSkeletonProps) => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/4 mb-4" /> {/* Form Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Label */}
            <Skeleton className="h-12 w-full" /> {/* Input */}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" /> {/* Label */}
        <Skeleton className="h-32 w-full" /> {/* Textarea */}
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
