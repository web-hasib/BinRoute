"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSubmitContactMutation } from "@/redux/api/contact/contactApi";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";

const LIBRARIES: ("places")[] = ["places"];

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [submitContact, { isLoading }] = useSubmitContactMutation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

  const officeLocation = React.useMemo(() => ({
    lat: Number(process.env.NEXT_PUBLIC_OFFICE_LATITUDE) || 42.2626,
    lng: Number(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE) || -71.8023,
  }), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact(data).unwrap();
      toast.success("Message sent successfully! We will contact you shortly.");
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <section className="py-16 md:py-20 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Card */}
          <motion.div 
            className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-200 rounded-xl shadow-xs"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mb-6">
              <span className="block text-xs font-bold uppercase text-[#0060AF] mb-1.5">
                Direct Message
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                Leave a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and dispatch will get back to you within 1 business hour.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-3 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                      errors.name ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#0060AF] focus:bg-white"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#0060AF] focus:bg-white"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Subject *
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  placeholder="e.g. 15-Yard Dumpster Quote for Shrewsbury"
                  className={`w-full px-3 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                    errors.subject ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#0060AF] focus:bg-white"
                  }`}
                />
                {errors.subject && (
                  <p className="text-[11px] text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Project Details / Message *
                </label>
                <textarea
                  {...register("message")}
                  placeholder="Tell us about your project location, estimated delivery date, and debris type..."
                  rows={4}
                  className={`w-full px-3 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none ${
                    errors.message ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#0060AF] focus:bg-white"
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 rounded-md"
                >
                  {isLoading ? <Loader2 className="animate-spin size-4" /> : <Send className="size-4" />}
                  <span>{isLoading ? "Sending Message..." : "Send Message"}</span>
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Direct Info & Map */}
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Contact Info Cards */}
            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Direct Contact Information
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need immediate booking assistance? Contact our local dispatch desk directly.
              </p>

              <div className="space-y-2.5 pt-1">
                <a
                  href="tel:7746221884"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors group"
                >
                  <div className="size-8.5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#0060AF] group-hover:bg-[#0060AF] group-hover:text-white transition-colors shadow-2xs">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">Direct Phone Line</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0060AF] transition-colors">(774) 622-1884</span>
                  </div>
                </a>

                <a
                  href="mailto:labontedisposal@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors group"
                >
                  <div className="size-8.5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#0060AF] group-hover:bg-[#0060AF] group-hover:text-white transition-colors shadow-2xs">
                    <Mail className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] text-slate-500 font-medium">Email Dispatch</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0060AF] transition-colors truncate block">labontedisposal@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="size-8.5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#0060AF] shrink-0 mt-0.5 shadow-2xs">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">Headquarters</span>
                    <span className="text-xs font-bold text-slate-900">1114 Pleasant St, Worcester, MA 01602</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Map */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-xs">
               {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={officeLocation}
                    zoom={15}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                  >
                    <MarkerF position={officeLocation} />
                  </GoogleMap>
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-5 text-[#0060AF] animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Loading map...</span>
                  </div>
               )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
