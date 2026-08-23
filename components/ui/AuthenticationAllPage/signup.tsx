"use client";

import { useSignUpMutation } from "@/redux/api/auth/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface FormErrors {
  general?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [register, { isLoading }] = useSignUpMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!firstName || !lastName || !email || !password) {
      setErrors({ general: "Please fill in all fields." });
      return;
    }

    if (password.length < 8) {
      setErrors({ password: "Must be at least 8 characters." });
      return;
    }

    try {
      const res = await register({
        fullName: `${firstName} ${lastName}`,
        email,
        password,
      }).unwrap();

      toast.success(res.message || "Account created successfully! Please verify your email.");
      router.push(`/verify-otp?userId=${res.data.id}&type=email`);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f8fafc]">
      {/* Left: Registration Form */}
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
              Create an account
            </h1>
            <p className="text-xs text-slate-500 text-center">
              Set up your customer account for faster bookings and invoicing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-red-600 text-xs">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-xs font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xs text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0061AA] focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-xs font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xs text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0061AA] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
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

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
              {errors.password && (
                <p className="text-[11px] text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full py-2.5 mt-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              <span>{isLoading ? "Creating account..." : "Create Account"}</span>
            </Button>
          </form>

          {/* Log In Link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <a href="/login" className="text-[#0061AA] font-semibold hover:underline">
                Sign in
              </a>
            </p>
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
            Quick Registration
          </span>
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug">
            Streamlined Waste Management Solutions
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Get instant price transparency, fast scheduling, and full visibility over your roll-off containers.
          </p>
        </div>
      </div>
    </div>
  );
}
