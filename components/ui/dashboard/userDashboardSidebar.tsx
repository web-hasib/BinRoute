"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings2,
  Table,
  ShoppingCart,
  User,
  Layers2,
  UserPen,
  TagIcon,
  TextQuote,
  LayoutDashboard,
  Calendar,
  CreditCard,
  FileText,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/user/userSlice";
import Image from "next/image";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/user",
    active: false,
  },
  {
    title: "Service Schedule",
    icon: Calendar,
    href: "/dashboard/user/schedule",
    active: false,
  },
  {
    title: "Payment History",
    icon: History,
    href: "/dashboard/user/payment-history",
    active: false,
  },
  { title: "Billing & Payment", icon: CreditCard, href: "#" },
  { title: "Service Requests", icon: FileText, href: "#" },
];

export function UserDashboardSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    window.location.href = "/login";
  };

  const sidebarContent = (
    <>
      {/* Logo & Toggle */}
      <div className="flex items-center  justify-between p-4 border-b">
        {!collapsed && <div></div>}
        {/* Desktop toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-9 w-9 ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden h-9 w-9 ml-auto"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {!collapsed &&  <div className="bg-white mb- p-8 rounded-none shadow-sm flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src="/dummy.png" // Using existing dummy image
                alt="Tomas Diko"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-[#172C41]">Tomas Diko</h2>
            <p className="text-gray-500 text-sm mb-6">@tomasdiko</p>
            <Link href="/dashboard/user/profile">
            <Button
              variant="outline"
              className="w-full rounded-none border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
            >
              Edit Profile
            </Button>
            </Link>
          </div>
        }
     

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                 className={cn(
                                    "flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors border-l-4",
                                    isActive
                                        ? "bg-blue-50 text-[#006CF9] border-[#006CF9]"
                                        : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900",
                                        collapsed && "lg:justify-center",
                                )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive && "text-[#006CF9]",
                    )}
                  />
                  {/* Always show label on mobile; hide when collapsed on desktop */}
                  <span className={cn("text-base", collapsed && "lg:hidden")}>
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center cursor-pointer gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50",
            collapsed && "lg:justify-center",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className={cn("text-base", collapsed && "lg:hidden")}>
            Log out
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger — top-left, only on <lg */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-1 z-50 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-gray-50 transition"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg transition-all duration-300",
          // Desktop: collapses to icon-only width
          "lg:relative lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
          // Mobile: full width drawer, slides in/out
          "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
