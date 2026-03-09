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



      <div className="flex-1 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
        <div className="w-full max-w-xl bg-white rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/logoHome.png"
            alt="Logo"
            width={64}
            height={56}
            className="object-cover mb-6"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
            Forget Password
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
            Please enter the email address that you used when creating your account
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
                placeholder="Please enter email address"
                required
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-3.5 px-4 cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              style={{
                background: "#0061AA",
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
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-700 font-semibold hover:text-blue-700 transition"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>

      {/* Right: Illustration with Overlay */}
      <div className="hidden md:block relative w-1/2 flex-shrink-0">
        <Image
          src="/login-image.png"
          alt="Login illustration"
          fill
          priority
          className="object-cover"
        />
        {/* Dark Branded Overlay */}
        <div className="absolute bottom-10 left-10 right-10 bg-[#001D3D]/60 backdrop-blur-md p-8 text-white border border-white/10">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Manage Your Waste Services with Ease</h2>
          <p className="text-sm text-gray-200 leading-relaxed max-w-lg">
            Professional logistics and dumpster rental services for construction, commercial, and industrial projects.
          </p>
        </div>
      </div>
    </div>
  );
}
