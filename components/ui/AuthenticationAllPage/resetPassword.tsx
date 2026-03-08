// app/reset-password/page.tsx
"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { toast } from "sonner";

import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/api/auth/authApi";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reset, { isLoading }] = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>(
    {},
  );
  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendErrors({});

    if (newPassword !== confirmPassword) {
      setBackendErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!token) {
      toast.error("token not found");
      return;
    }

    try {
      await reset({
        token,
        password: newPassword, // ← ONLY THIS
      }).unwrap();
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errors = err?.data?.errors || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = errors.reduce((acc: any, e: any) => {
        acc[e.path] = e.message;
        return acc;
      }, {});
      setBackendErrors(map);
    }
  };

  return (
    <div className="">
      <div className="flex h-screen w-full overflow-hidden font-sans ">
        <div className="hidden md:block relative w-1/2 h-full flex-shrink-0">
          <Image
            src="/auth-iamge.png"
            alt="Login illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
          <div className="w-full max-w-xl bg-white border border-blue-300 rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/login-logo.png"
            alt="Login illustration"
            width={64}
            height={56}
            className="object-cover mb-6"
          />
          <div className=" mb-6">
            <h1 className="text-3xl font-semibold text-black">
              Enter new password{" "}
            </h1>
            <p className="text-black text-sm mt-4">
              Please create a new password to continue.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 text-gray-700 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-6 text-sm"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-black" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
              {backendErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {backendErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 text-gray-700  pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {backendErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {backendErrors.confirmPassword}
                </p>
              )}
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-[#0067AB]  text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
