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
import { useVerifyOtpMutation, useEmailVerifyOtpMutation } from "@/redux/api/auth/authApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading: isResetLoading }] = useVerifyOtpMutation();
  const [emailVerifyOtp, { isLoading: isEmailLoading }] = useEmailVerifyOtpMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("userId");
  const type = searchParams.get("type");

  const isLoading = isResetLoading || isEmailLoading;

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
      toast.error("Please enter a complete 6-digit verification code");
      return;
    }

    try {
      if (type === "email") {
        const response = await emailVerifyOtp({
          userId: id || "",
          otpCode: otpString,
        }).unwrap();
        toast.success(response.message || "Email verified successfully!");
        router.push("/login");
      } else {
        const response = await verifyOtp({
          userId: id || "",
          otpCode: otpString,
        }).unwrap();
        const accessToken = response.data?.accessToken;
        toast.success(response.message || "Code verified successfully!");
        router.push(
          "/reset-password?accessToken=" + encodeURIComponent(accessToken || ""),
        );
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid code. Please try again.");
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
              alt="Labonte Disposal"
              width={100}
              height={40}
              className="h-8 w-auto object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Verify Security Code
            </h1>
            <p className="text-xs text-slate-500 text-center max-w-xs">
              Enter the 6-digit security code sent to your registered email address.
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-3 text-center">
                6-Digit Verification Code
              </label>
              <div className="flex gap-2 justify-center">
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
                    className={`size-11 sm:size-12 text-center text-slate-900 text-lg font-bold border rounded-xs outline-none transition-colors ${
                      digit
                        ? "border-[#0061AA] bg-blue-50/40"
                        : "border-slate-200 bg-[#f8fafc] focus:border-[#0061AA] focus:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || otp.join("").length !== 6}
              variant="primary"
              className="w-full py-2.5"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
            </Button>
          </div>

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
          alt="Labonte Disposal Fleet"
          fill
          priority
          className="object-cover opacity-40 filter brightness-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <span className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            Two-Step Verification
          </span>
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug">
            Protected Account Operations
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            We use verified authentication to protect your booking records, billing methods, and jobsite deliveries.
          </p>
        </div>
      </div>
    </div>
  );
}
