"use client";

import Image from "next/image";
import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/redux/api/auth/authApi";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("userId");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtp({
        userId: id || "",
        otpCode: otpString,
      }).unwrap();
      const accessToken = response.data?.accessToken;
      toast.success(response.message || "OTP verified successfully!");
      router.push(
        "/reset-password?accessToken=" + encodeURIComponent(accessToken || ""),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Right: Form Panel */}
      <div className="flex-1 border border-blue-200 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
        <div className="w-full max-w-xl bg-white border border-blue-300 rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/logoHome.png"
            alt="Login illustration"
            width={96}
            height={56}
            className="object-cover mb-6"
          />
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-400 mb-1 text-center leading-relaxed">
            Please enter the 6-digit verification code
          </p>

          <div className="w-full space-y-6">
            {/* OTP Inputs */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                OTP Code
              </label>
              <div className="flex gap-3 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-8 h-8 md:w-12 md:h-12 text-center text-gray-800 text-sm md:text-xl font-bold border border-gray-200 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                    style={
                      digit
                        ? { borderColor: "#2563eb", background: "#eff6ff" }
                        : {}
                    }
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full text-white font-semibold py-3.5 px-4 rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
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
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>

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

      {/* Left: Full bleed image */}
      <div className="hidden md:block relative w-1/2 flex-shrink-0">
        <Image
          src="/login-image.png"
          alt="Sign up illustration"
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
