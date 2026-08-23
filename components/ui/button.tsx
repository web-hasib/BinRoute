import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] active:translate-y-0 [&_svg:not([class*='size-'])]:size-4 rounded-md before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700",
  {
    variants: {
      variant: {
        default:
          "bg-[#0060AF] hover:bg-[#004D8C] text-white border border-[#004D8C] hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-900/20 shadow-xs",
        primary:
          "bg-[#0060AF] hover:bg-[#004D8C] text-white border border-[#004D8C] hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-900/20 shadow-xs px-5 py-2.5",
        dark:
          "bg-[#0B132B] hover:bg-[#1C2541] text-white border border-slate-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-950/30 shadow-xs",
        outline:
          "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#0060AF] hover:text-[#0060AF] hover:-translate-y-0.5 hover:shadow-sm before:via-blue-500/10 shadow-2xs",
        secondary:
          "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:-translate-y-0.5 hover:shadow-xs",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 text-slate-700 before:hidden",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white border border-red-700 hover:-translate-y-0.5 hover:shadow-sm shadow-2xs",
        link:
          "text-[#0060AF] underline-offset-4 hover:underline p-0 h-auto font-semibold before:hidden",
        blue:
          "bg-[#0060AF] hover:bg-[#004D8C] text-white border border-[#004D8C] hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-900/20 shadow-xs",
      },
      size: {
        default: "h-9.5 gap-2 px-4.5 py-2",
        xs: "h-6.5 gap-1 px-2.5 text-xs",
        sm: "h-8 gap-1.5 px-3.5 text-xs",
        lg: "h-11 gap-2.5 px-6 text-sm font-semibold",
        xl: "h-12 gap-3 px-7 text-base font-bold",
        icon: "size-9",
        "icon-xs": "size-6.5",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
