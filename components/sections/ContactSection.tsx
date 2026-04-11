"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSubmitContactMutation } from "@/redux/api/contact/contactApi";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [submitContact, { isLoading }] = useSubmitContactMutation();

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
      toast.success("Message sent successfully!");
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Please try again.");
    }
  };


  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column: Form */}
          <div className="bg-white p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-8">
              Leave your message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your Name"
                    className={`w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors ${
                      errors.name ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Your Email"
                    className={`w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors ${
                      errors.email ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Subject
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  placeholder="Subject"
                  className={`w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors ${
                    errors.subject ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  {...register("message")}
                  placeholder="Message"
                  rows={6}
                  className={`w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors resize-none ${
                    errors.message ? "ring-2 ring-red-500" : ""
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-12 py-6 bg-[#0061AA] hover:bg-[#004e89] text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="animate-spin size-5" />}
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="space-y-12 py-4">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540]">
                Don&apos;t hesitate to contact us
              </h2>
              <p className="text-gray-600 md:text-lg">
                If you need a dumpster for your home, job site, or business, we
                are here to help. Call or email us today!
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-[#0A2540]">
                  <Phone className="size-6 text-[#0061AA]" />
                  <span className="text-lg font-semibold">774-622-1884</span>
                </div>
                <div className="flex items-center gap-4 text-[#0A2540]">
                  <Mail className="size-6 text-[#0061AA]" />
                  <span className="text-lg font-semibold">
                    labontedisposal@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[#0A2540]">
                  <MapPin className="size-6 text-[#0061AA]" />
                  <span className="text-lg font-semibold">Worcester MA</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative aspect-video w-full overflow-hidden shadow-lg">
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <p className="transform -rotate-30 text-2xl font-bold text-black/50 text-center px-4 drop-shadow-md">
                  here will be Dynamic map later
                </p>
              </div>
              <Image
                src="/contact/map.png"
                alt="Worcester Map"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default ContactSection;
