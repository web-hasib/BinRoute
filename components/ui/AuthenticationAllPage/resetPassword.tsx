"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/api/auth/authApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reset, { isLoading }] = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get("accessToken");

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>(
    {},
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendErrors({});

    if (Password !== confirmPassword) {
      setBackendErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!accessToken) {
      toast.error("Token not found. Please use the link from your email again.");
      return;
    }

    try {
      await reset({
        accessToken: accessToken!,
        newPassword: Password,
      }).unwrap();

      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1800);
    } catch (err: any) {
      const errors = err?.data?.errors || err?.data?.message || [];

      if (typeof errors === "string") {
        toast.error(errors);
      } else {
        const map = errors.reduce((acc: any, e: any) => {
          acc[e.path || "general"] = e.message;
          return acc;
        }, {});
        setBackendErrors(map);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f8fafc]">
      {/* Left: Form Panel */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-xs p-8 sm:p-10 shadow-2xs">
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Bin Route "
                width={100}
                height={40}
                className="h-12 w-auto object-contain mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Create New Password
            </h1>
            <p className="text-xs text-slate-500 text-center max-w-xs">
              Please enter and confirm your new secure password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold text-slate-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#f8fafc] border border-slate-200 rounded-xs text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0061AA] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {backendErrors.password && (
                <p className="text-[11px] text-red-500">
                  {backendErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#f8fafc] border border-slate-200 rounded-xs text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0061AA] focus:bg-white transition-colors"
                />
              </div>
              {backendErrors.confirmPassword && (
                <p className="text-[11px] text-red-500">
                  {backendErrors.confirmPassword}
                </p>
              )}
              {Password &&
                confirmPassword &&
                Password !== confirmPassword && (
                  <p className="text-[11px] text-red-500">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full py-2.5 mt-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              <span>{isLoading ? "Updating Password..." : "Update Password"}</span>
            </Button>
          </form>

          {/* Back to Login */}
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
            Password Update
          </span>
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug">
            Your Account Security Matters
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Choose a strong password with a mix of letters, numbers, and symbols to protect your account.
          </p>
        </div>
      </div>
    </div>
  );
}
