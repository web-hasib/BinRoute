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

      toast.success("Password reset successfully!");
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
    <div className="">
      <div className="flex h-screen w-full overflow-hidden font-sans ">


        <div className="flex-1 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
          <div className="w-full max-w-xl bg-white rounded-2xl px-10 py-12 flex flex-col items-center">
            <Image
              src="/logoHome.png"
              alt="Logo"
              width={96}
              height={56}
              className="object-cover mb-6"
            />

            {/* Heading */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
              Enter new password
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
              Please create a new password to continue.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Please enter new password"
                    required
                    className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Please confirm password"
                    required
                    className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400 font-sans"
                  />
                </div>
                {backendErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {backendErrors.confirmPassword}
                  </p>
                )}
                {Password &&
                  confirmPassword &&
                  Password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-semibold py-3.5 px-4 cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 rounded-none"
                style={{
                  background: "#0061AA",
                }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* Divider line */}
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

        {/* Right: Login Panel — scrollable, centered */}
        <div className="hidden md:block relative w-1/2  flex-shrink-0">
          <Image
            src="/hero.png"
            alt="Login illustration"
            fill
            priority
            className=""
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
    </div>
  );
}
