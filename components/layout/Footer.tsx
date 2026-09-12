import React from "react";
import Link from "next/link";
import {
  Trash2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#010D18] text-white pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col mb-4">
              <Image
                src="/logo.png"
                className="grayscale hover:grayscale-0 transition duration-300"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Fast waste removal across central Massachusetts and greater Boston
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-gray-400 uppercase text-xs tracking-widest">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  FAQS
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/services/service-areas"
                  className="hover:text-blue-400 transition-colors"
                >
                  Service Areas
                </Link>
              </li>
            </ul>
          </div>

          {/* Rentals */}
          <div>
            <h4 className="font-semibold mb-6 text-gray-400 uppercase text-xs tracking-widest">
              Rentals
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <Link
                  href="/services/service-areas"
                  className="hover:text-blue-400 transition-colors"
                >
                  Commercial Service
                </Link>
              </li>
              <li>
                <Link
                  href="/services/service-areas"
                  className="hover:text-blue-400 transition-colors"
                >
                  Residential Service
                </Link>
              </li>
              <li>
                <Link
                  href="/services/service-areas"
                  className="hover:text-blue-400 transition-colors"
                >
                  Dumpster Sizes
                </Link>
              </li>
            </ul>
          </div>

          {/* Reach Out */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-6 text-gray-400 uppercase text-xs tracking-widest">
              Reach Out
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href="tel:774-622-884"
                  className="hover:text-blue-400 transition-colors"
                >
                  774-622-884
                </a>
              </li>
              <li className="flex items-center gap-3 text-wrap overflow-hidden">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <a
                  href="mailto:binroutedisposal@gmail.com"
                  className="hover:text-blue-400 transition-colors truncate"
                >
                  binroutedisposal@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                <span className="text-gray-400">
                  1114 Pleasant St,
                  <br />
                  Worcester MA 01602
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mb-32 border-t border-[#1A2631] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 text-gray-200 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms-condition" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
          <p className="text-gray-400 text-xs">
            © 2024 <span className="italic">Bin Route</span> Dumpster
            Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-xs">Follow us :</span>
            <div className="flex gap-3">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Large Text */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full text-center select-none pointer-events-none opacity-10">
        <h1 className="text-[12vw] font-bold leading-none tracking-tighter text-white whitespace-nowrap">
          Bin Route
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
