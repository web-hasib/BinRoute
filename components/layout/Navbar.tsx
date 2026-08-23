"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, User, LayoutDashboard, LogOut, ArrowRight } from "lucide-react";
import { DumpTruckIcon } from "@/components/icons/DumpTruckIcon";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Services",
      href: "/#services",
      dropdown: [{ name: "Service Areas", href: "/services/service-areas" }],
    },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  const handleDashboardRedirect = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    if (user?.role === "USER") {
      router.push("/dashboard/user");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-18">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image
              src="/LogoHome.png"
              alt="Labonte Disposal"
              width={92}
              height={46}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition-all rounded-[2px] ${
                    isActive(link.href)
                      ? "text-[#0060AF] bg-blue-50/70"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.dropdown && (
                    <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-[2px] shadow-sm py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0060AF] transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth & CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-[2px] border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                >
                  <div className="size-7 rounded-[2px] bg-[#0060AF] text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="size-4 text-white" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown
                    className={`size-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-[2px] shadow-sm py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleDashboardRedirect}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0060AF] transition-colors"
                      >
                        <LayoutDashboard className="size-3.5 text-slate-400" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                      >
                        <LogOut className="size-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold px-3.5"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/services/service-areas">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold px-4"
                  >
                    <DumpTruckIcon className="size-3.5" />
                    <span>Order Dumpster</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-[2px] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-in fade-in duration-150">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-2 text-xs font-semibold rounded-[2px] transition-colors ${
                      isActive(link.href)
                        ? "text-[#0060AF] bg-blue-50/70"
                        : "text-slate-800 hover:text-[#0060AF] hover:bg-slate-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="mt-1 pl-3 flex flex-col gap-1 border-l-2 border-slate-200 ml-3">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-[#0060AF]"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-[2px] mb-1">
                      <div className="size-7 rounded-[2px] bg-[#0060AF] text-white flex items-center justify-center font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="size-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDashboardRedirect}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      My Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/services/service-areas" className="w-full">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Order Dumpster
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
