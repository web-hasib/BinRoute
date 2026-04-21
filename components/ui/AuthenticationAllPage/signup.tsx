"use client";

import { useSignUpMutation } from "@/redux/api/auth/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoogleLoginMutation } from "@/redux/api/auth/authApi";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/feature/user/userSlice";

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
      await register({
        fullName: `${firstName} ${lastName}`,
        email,
        password,
      }).unwrap();

      toast.success("Account created successfully!");
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left: Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-white  px-6">
        <div className="w-full max-w-xl bg-white rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/LogoHome.png"
            alt="Logo"
            width={96}
            height={56}
            className="object-cover mb-6"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
            Create an Account
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
            Log back into your account or create a new one if you haven&apos;t signed up yet.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm ">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="eg. John"
                  required
                  className="w-full px-4 py-3 text-gray-700   bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="eg. Alax"
                  required
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eg. johnfrans@gmail.com"
                required
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Please enter password"
                  required
                  className="w-full px-4 py-3 pr-12 text-gray-700 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition text-sm placeholder-gray-400 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 transition"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">Must be at least 8 characters.</p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-3.5 px-4 cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed text-sm bg-[#0061AA]"
              style={{
                boxShadow: "0 4px 14px 0 rgba(37,99,235,0.35)",
              }}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Log In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-blue-700 font-semibold hover:underline">
                Log in
              </a>
            </p>
          </div>

          {/* Privacy Policy */}
          <p className="mt-8 text-xs text-gray-400 text-center leading-relaxed">
            By signing in you agree to HiDock{" "}
            <a href="/privacy" className="underline">Privacy Policy</a> &{" "}
            <a href="/terms" className="underline">Terms of Use</a>.
          </p>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:block relative w-1/2 flex-shrink-0">
        <Image
          src="/hero.png"
          alt="Sign up illustration"
          fill
          priority
          className=""
        />
        {/* Overlay Text */}
        <div className="absolute bottom-10 left-10 right-10 bg-black/40 backdrop-blur-md p-8 text-white border border-white/10">
          <h2 className="text-2xl font-bold mb-2">Manage Your Waste Services with Ease</h2>
          <p className="text-sm text-gray-200 leading-relaxed max-w-md">
            Professional logistics and dumpster rental services for construction, commercial, and industrial projects.
          </p>
        </div>
      </div>
    </div>
  );
}
