"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/auth/authApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sendOtp, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await sendOtp({ email }).unwrap();
      const userId = response.data?.id;
      toast.success(response.message || "Verification code sent! Check your email.");
      router.push(`/verify-otp?userId=${encodeURIComponent(userId)}`);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send verification code");
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f8fafc]">
      {/* Left: Form Panel */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-xs p-8 sm:p-10 shadow-2xs">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/LogoHome.png"
              alt="Bin Route "
              width={100}
              height={40}
              className="h-8 w-auto object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Reset Password
            </h1>
            <p className="text-xs text-slate-500 text-center max-w-xs">
              Enter your registered email address to receive a 6-digit verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xs text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0061AA] focus:bg-white transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full py-2.5 mt-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              <span>{isLoading ? "Sending Code..." : "Send Verification Code"}</span>
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#0061AA] font-semibold hover:underline"
            >
              <ArrowLeft className="size-3" />
              <span>Back to Login</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right Hero Visual */}
      <div className="hidden lg:block relative w-1/2 bg-slate-950">
        <Image
          src="/hero.png"
          alt="Bin Route  Fleet"
          fill
          priority
          className="object-cover opacity-40 filter brightness-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <span className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            Account Recovery
          </span>
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug">
            Secure & Fast Access
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Easily reset your login credentials and regain full control over your active dumpster rentals.
          </p>
        </div>
      </div>
    </div>
  );
}
