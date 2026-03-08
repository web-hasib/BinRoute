"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/auth/authApi";


export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sendOtp, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await sendOtp({ email }).unwrap();
      toast.success(response.message || "OTP sent! Check your email.");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left: Full bleed image */}
      <div className="hidden md:block relative w-1/2 h-full flex-shrink-0">
        <Image
          src="/auth-iamge.png"
          alt="Forgot password illustration"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
        <div className="w-full max-w-xl bg-white border border-blue-300 rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/login-logo.png"
            alt="Login illustration"
            width={64}
            height={56}
            className="object-cover mb-6"
          />

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Forget Password
          </h2>
          <p className="text-sm text-gray-400 mb-8 text-center leading-relaxed">
            Please enter the email address that you used when
            <br className="hidden sm:block" /> creating your account
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xyz@gmail.com"
                required
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm placeholder-gray-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-3.5 px-4 rounded-xl cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              style={{
                background: "#2563eb",
                boxShadow: "0 4px 14px 0 rgba(37,99,235,0.35)",
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full h-px bg-gray-100 my-6" />

          {/* Back to Login */}
          <p className="text-sm text-gray-400">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
