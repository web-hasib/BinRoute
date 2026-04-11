"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  FileText,
  Calendar,
  Contact,
  Briefcase,
  Users,
  BarChart3,
  Package,
  MapPin,
  Newspaper,
  HelpCircle,
  Headphones,
  Shield,
  Gavel,
  Settings,
  PanelLeft,
  ChevronsUpDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/user/userSlice";
import Image from "next/image";
import { cn } from "@/lib/utils";

const menuGroups = [
  {
    label: "OPERATIONS",
    items: [
      { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      { title: "Booking", icon: FileText, href: "/dashboard/booking" },
      { title: "Schedule", icon: Calendar, href: "/dashboard/schedule" },
      { title: "Drivers", icon: Contact, href: "/dashboard/drivers" },
      { title: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
      { title: "Customers", icon: Users, href: "/dashboard/customers" },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      { title: "Reports", icon: BarChart3, href: "/dashboard/reports" },
      { title: "Dumpster", icon: Package, href: "/dashboard/dumpster" },
      { title: "Services Area", icon: MapPin, href: "/dashboard/services-area" },
    ],
  },
  {
    label: "WEBSITE",
    items: [
      { title: "Blog", icon: Newspaper, href: "/dashboard/blog" },
      { title: "FAQ", icon: HelpCircle, href: "/dashboard/faq" },
      { title: "Contact US", icon: Headphones, href: "/dashboard/contact-us" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { title: "Privacy Policy", icon: Shield, href: "/dashboard/privacy-policy" },
      { title: "Terms & Condition", icon: Gavel, href: "/dashboard/terms-condition" },
      { title: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export function DashboardSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userImage, setUserImage] = useState("/icon/user-avatar.png");

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
    <div className="flex flex-col h-full bg-[#F2F2F2]">
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b bg-[#F2F2F2] min-h-[80px]">
        {!collapsed && (
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={50}
              className="w-auto"
            />
          </Link>
        )}
        {/* Desktop toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-10 w-10 ml-auto text-[#0061AA] hover:bg-blue-50"
        >
          <PanelLeft className={cn("h-6 w-6 transition-transform", collapsed && "rotate-180")} />
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

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            {!collapsed && (
              <h3 className="px-4 mb-4 text-xs font-medium text-[#A0AEC0] tracking-wide uppercase">
                {group.label}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative group/item w-full px-2">
                    {/* Active Bar for Expanded View */}
                    {isActive && !collapsed && (
                      <div className="absolute -left-2 top-0 h-full w-1.5 rounded-r-full bg-[#0061AA] z-10" />
                    )}

                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center transition-all duration-200 relative",
                        collapsed
                          ? "justify-center h-12 w-12 mx-auto rounded-xl my-3"
                          : "gap-3 px-4 py-3 my-2 rounded-none", // Rectangular in expanded view
                        isActive
                          ? collapsed
                            ? "bg-[#0061AA] text-white shadow-md"
                            : "bg-white text-[#0061AA] shadow-sm ml-2"
                          : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive && !collapsed && "text-[#0061AA]",
                          isActive && collapsed && "text-white"
                        )}
                      />
                      {!collapsed && (
                        <span className="text-[15px] font-medium">
                          {item.title}
                        </span>
                      )}

                      {/* Tooltip for Collapsed View */}
                      {collapsed && (
                        <div className="fixed left-20 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible scale-95 group-hover/item:opacity-100 group-hover/item:visible group-hover/item:scale-100 transition-all duration-200 whitespace-nowrap z-[100] pointer-events-none shadow-xl">
                          {item.title}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t bg-[#F2F2F2] mt-auto">
        <div className={cn("flex items-center gap-3", collapsed && "lg:justify-center")}>
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={userImage}
              alt="Avatar"
              fill
              className="rounded-full object-cover"
              onError={() => {
                if (!userImage.includes("ui-avatars.com")) {
                  setUserImage("https://ui-avatars.com/api/?name=Handymates&background=0061AA&color=fff");
                }
              }}
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[15px] font-bold text-[#1A202C] truncate">Handymates</p>
              <p className="text-xs text-[#718096] truncate">@Handymates</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-[#718096] hover:text-[#0061AA] transition-colors ml-auto"
            >
              <ChevronsUpDown className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger — top-left, only on <lg */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-1 z-40 lg:hidden bg-gray-100 rounded-sm p-2 hover:bg-gray-200 transition cursor-pointer"
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
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300",
          "lg:relative lg:translate-x-0 border-r border-gray-100",
          collapsed ? "lg:w-20" : "lg:w-72",
          "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}