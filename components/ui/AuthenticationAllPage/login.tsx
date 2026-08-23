"use client";

import { setCredentials } from "@/feature/user/userSlice";
import { useLogInMutation } from "@/redux/api/auth/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useGoogleLoginMutation } from "@/redux/api/auth/authApi";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface FormErrors {
  general?: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [signIn, { isLoading }] = useLogInMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  useEffect(() => {
    const initializeGoogle = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE",
          callback: handleGoogleResponse,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("googleButtonDiv"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "center"
          }
        );
      }
    };

    const interval = setInterval(() => {
      if ((window as any).google) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await googleLogin(response.credential).unwrap();
      if (res.success) {
        const accessToken = res.accessToken || res.data?.accessToken;
        const userData = res.data?.user || res.data;
        const { id, fullName, email: userEmail, role } = userData;

        const user: UserProfile = {
          id: id || userData.id,
          name: fullName || userData.fullName,
          email: userEmail || userData.email,
          role: role || userData.role,
        };

        dispatch(setCredentials({ user, accessToken }));

        if (accessToken && accessToken !== "undefined") {
          Cookies.set("accessToken", accessToken);
        }

        toast.success("Login successfully with Google");

        if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "SUPER_ADMIN" || role?.toUpperCase() === "ADMIN") {
          router.push("/dashboard");
        } else if (role?.toUpperCase() === "DRIVER") {
          router.push("/dashboard");
        } else if (role?.toUpperCase() === "USER") {
          router.push("/dashboard/user");
        } else {
          const params = new URLSearchParams(window.location.search);
          const callback = params.get("callbackUrl") || params.get("callback") || "/dashboard/user";
          router.push(callback);
        }
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Google login failed");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ general: "Please enter both email and password." });
      return;
    }

    try {
      const response = await signIn({ email, password }).unwrap();

      if (response.success) {
        const accessToken = response.accessToken || response.data?.accessToken;
        const userData = response.data?.user || response.data;
        const { id, fullName, email: userEmail, role } = userData;

        const user: UserProfile = {
          id: id || userData.id,
          name: fullName || userData.fullName,
          email: userEmail || userData.email,
          role: role || userData.role,
        };

        dispatch(setCredentials({ user, accessToken }));

        if (accessToken && accessToken !== "undefined") {
          Cookies.set("accessToken", accessToken);
        }

        toast.success("Login successfully");

        if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "SUPER_ADMIN" || role?.toUpperCase() === "ADMIN") {
          router.push("/dashboard");
        } else if (role?.toUpperCase() === "DRIVER") {
          router.push("/dashboard");
        } else if (role?.toUpperCase() === "USER") {
          router.push("/dashboard/user");
        } else {
          const params = new URLSearchParams(window.location.search);
          const callback = params.get("callbackUrl") || params.get("callback") || "/dashboard/user";
          router.push(callback);
        }

        router.refresh();
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f8fafc]">
      {/* Left Form Panel */}
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
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 text-center">
              Sign in to manage your dumpster rentals and pickups
            </p>
          </div>

          {/* Google Sign In */}
          <div id="googleButtonDiv" className="w-full mb-5 flex justify-center min-h-[44px]"></div>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-5">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-xs text-slate-400 font-medium">Or continue with email</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-red-600 text-xs">
                {errors.general}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#0061AA] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded-xs border-slate-300 text-[#0061AA] focus:ring-0 cursor-pointer accent-[#0061AA]"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none">
                Remember me on this device
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full py-2.5 mt-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>
            </Button>
          </form>

          {/* Sign Up Footer */}
          <p className="text-center text-xs text-slate-500 mt-6 pt-6 border-t border-slate-100">
            Do not have an account?{" "}
            <a href="/signup" className="text-[#0061AA] font-semibold hover:underline">
              Create account
            </a>
          </p>
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
            Customer Portal
          </span>
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug">
            Manage Dumpster Rentals with Clarity
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Schedule deliveries, track container swap-outs, download invoices, and manage service areas seamlessly in one dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
