"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Services",
      href: "/#services",
      dropdown: [{ name: "Service Areas", href: "/services/service-areas" }],
    },
    { name: "About us", href: "/about" },
    { name: "Faq", href: "/faq" },
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
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            <Image
              src="/LogoHome.png"
              alt="Logo"
              width={100}
              height={100}
              className=""
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${link.name === "Home"
                      ? "text-[#0056B3]"
                      : "text-[#4A4A4A] hover:text-[#0056B3]"
                    }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-[#4A4A4A] hover:bg-gray-50 hover:text-[#0056B3]"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                    <User className="text-gray-500 w-5 h-5" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleDashboardRedirect}
                        className="block w-full text-left px-4 py-2 text-sm text-[#4A4A4A] hover:bg-gray-50 hover:text-[#0056B3]"
                      >
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-[#4A4A4A] bg-[#F1F1F1] hover:bg-gray-200 px-8"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#0056B3] hover:bg-blue-700 px-8">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.name} className="group">
                  <Link
                    href={link.href}
                    className="block text-base font-medium text-[#4A4A4A] hover:text-[#0056B3]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="mt-2 pl-4 flex flex-col gap-2 border-l border-gray-200">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-sm text-[#4A4A4A] hover:text-[#0056B3]"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-2 px-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        <User className="text-gray-500 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDashboardRedirect}
                      variant="outline"
                      className="w-full text-[#0056B3] border-[#0056B3]"
                    >
                      My Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="secondary" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full bg-[#0056B3] hover:bg-blue-700">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
