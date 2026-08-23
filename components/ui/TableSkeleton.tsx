import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableSkeletonProps {
  columns: number
  rows?: number
}

export const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
  return (
    <div className="bg-white overflow-hidden border border-gray-100 rounded-none">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-[#fbfcff]">
            <TableRow className="border-b border-gray-100">
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i} className="px-6 py-4 border-none">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-gray-100 last:border-0">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-6 py-4 border-none">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
