"use client";

import { setCredentials } from "@/feature/user/userSlice";
import { useLogInMutation } from "@/redux/api/auth/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useEffect } from "react";
import { useGoogleLoginMutation } from "@/redux/api/auth/authApi";
import Cookies from "js-cookie";

// Define UserProfile type (shared with userSlice)
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

        // This renders the full-page popup button
        (window as any).google.accounts.id.renderButton(
          document.getElementById("googleButtonDiv"),
          {
            theme: "outline",
            size: "large",
            width: "510", // Approximate width to match your UI
            text: "continue_with",
            shape: "square",
            logo_alignment: "center"
          }
        );
      }
    };

    // Retry if script is not loaded yet
    const interval = setInterval(() => {
      if ((window as any).google) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleResponse = async (response: any) => {
    console.log(response, "response");
    try {
      const res = await googleLogin(response.credential).unwrap();
      if (res.success) {
        const { accessToken, refreshToken, id, fullName, email: userEmail, role, image, status } = res.data;
        const user: UserProfile = {
          id,
          name: fullName,           // ← important mapping
          email: userEmail,
          role,
        };
        dispatch(setCredentials({ user, accessToken }));
        Cookies.set("accessToken", accessToken);
        toast.success("Login successfully with Google");

        if (role === "SUPERADMIN" || role === "ADMIN") {
          router.push("/dashboard");
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

  /* No longer need onGoogleClick since we are using renderButton */

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
        // FIXED: API returns user fields directly in data (not nested under "user")
        const { accessToken, refreshToken, id, fullName, email: userEmail, role, image, status } = response.data;

        // Map to your UserProfile shape (interface expects "name", not "fullName")
        const user: UserProfile = {
          id,
          name: fullName,           // ← important mapping
          email: userEmail,
          role,
        };

        dispatch(setCredentials({ user, accessToken }));
        Cookies.set("accessToken", accessToken);

        toast.success("Login successfully");

        // Redirect logic
        if (role === "SUPERADMIN" || role === "ADMIN") {
          router.push("/dashboard");
        } else {
          // Redirect normal users to their intended page or dashboard
          const params = new URLSearchParams(window.location.search);
          const callback = params.get("callbackUrl") || params.get("callback") || "/dashboard/user";
          router.push(callback);
        }

        router.refresh(); // good practice (same as Google login)
      }
    } catch (error: any) {
      // This now only catches real API errors, not our own JS bugs
      const errorMessage = error?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left: Full bleed image */}

      <div className="flex-1 flex items-center justify-center bg-white overflow-y-auto py-10 px-6">
        <div className="w-full max-w-xl bg-white  rounded-2xl px-10 py-12 flex flex-col items-center">
          <Image
            src="/logoHome.png"
            alt="Login illustration"
            width={96}
            height={56}
            className="object-cover mb-6"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
            Login to your account
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
            Please log back into your account or create a new one if you haven&apos;t signed up yet.
          </p>
          {/* Google Sign In Button Container */}
          <div id="googleButtonDiv" className="w-full mb-6 flex justify-center h-[50px]"></div>

          {/* Divider */}
          <div className="w-full flex items-center mb-6 px-1">
            <div className="flex-1 border-t border-gray-100"></div>
            <span className="px-3 text-xs text-gray-400 font-medium">Or</span>
            <div className="flex-1 border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm ">
                {errors.general}
              </div>
            )}

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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
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
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-semibold text-gray-500 transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-3.5 px-4  cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              style={{
                background: "#0061AA",
                boxShadow: "0 4px 14px 0 rgba(37,99,235,0.35)",
              }}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Divider line */}
          <div className="w-full h-px bg-gray-100 my-6" />

          {/* Sign Up */}
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-700 font-semibold hover:text-blue-700 transition"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      {/* Right: Illustration with Overlay */}
      <div className="hidden md:block relative w-1/2 flex-shrink-0">
        <Image
          src="/hero.png"
          alt="Sign up illustration"
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
  );
}
