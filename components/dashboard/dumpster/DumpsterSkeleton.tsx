import { Skeleton } from "@/components/ui/skeleton"

export const DumpsterSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 p-6 flex flex-col sm:flex-row gap-6">
      {/* Image Skeleton */}
      <Skeleton className="w-full sm:w-[200px] h-[150px]" />

      {/* Info Skeleton */}
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="space-y-1 mt-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
    </div>
  )
}

export const DumpsterGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <DumpsterSkeleton key={i} />
      ))}
    </div>
  )
}
