import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#091524] text-white pt-16 pb-8 relative overflow-hidden border-t border-slate-800">
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                className="brightness-200 contrast-125 opacity-95 hover:opacity-100 transition-opacity"
                alt="Bin Route "
                width={85}
                height={42}
              />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Professional, dependable dumpster rental and waste disposal services for homeowners, contractors, and businesses across Worcester County and Central Massachusetts.
            </p>
            <p className="text-[11px] text-sky-400 font-medium">
              Licensed, Insured & Locally Operated in Worcester, MA
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3.5 text-slate-200 text-xs sm:text-sm">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Articles & Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Rentals & Services */}
          <div>
            <h4 className="font-bold mb-3.5 text-slate-200 text-xs sm:text-sm">
              Services
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <Link href="/services/service-areas" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Residential Roll-Off</span>
                  <ArrowUpRight className="size-3 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/services/service-areas" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Commercial Waste</span>
                  <ArrowUpRight className="size-3 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/services/service-areas" className="hover:text-white transition-colors">
                  10 to 30 Yard Dumpsters
                </Link>
              </li>
              <li>
                <Link href="/services/service-areas" className="hover:text-white transition-colors">
                  Worcester Service Areas
                </Link>
              </li>
            </ul>
          </div>

          {/* Reach Out */}
          <div className="lg:col-span-1">
            <h4 className="font-bold mb-3.5 text-slate-200 text-xs sm:text-sm">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-sky-400 shrink-0" />
                <a
                  href="tel:774-622-1884"
                  className="hover:text-white transition-colors text-slate-300 font-bold"
                >
                  (774) 622-1884
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-sky-400 shrink-0" />
                <a
                  href="mailto:LabonteDisposal@gmail.com"
                  className="hover:text-white transition-colors truncate text-slate-300 font-medium"
                >
                  LabonteDisposal@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 text-sky-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-xs leading-relaxed">
                  1114 Pleasant St,
                  <br />
                  Worcester, MA 01602
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex gap-4 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-condition" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-center sm:text-left text-[11px]">
            © {new Date().getFullYear()} Bin Route . All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 text-[11px]">Connect:</span>
            <div className="flex gap-2">
              <a href="#" className="p-1 rounded-[2px] bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="size-3.5" />
              </a>
              <a href="#" className="p-1 rounded-[2px] bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="size-3.5" />
              </a>
              <a href="#" className="p-1 rounded-[2px] bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="size-3.5" />
              </a>
              <a href="#" className="p-1 rounded-[2px] bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
