import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader — Reusable page-level heading with an optional subtitle and
 * right-aligned action slot (e.g. buttons).
 *
 * Usage:
 *   <PageHeader
 *     title="Dashboard Overview"
 *     subtitle="Monitor your platform performance and activity"
 *     actions={<Button>Create New Course</Button>}
 *   />
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row items-start  justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tighter text-slate-900 dark:text-white leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
