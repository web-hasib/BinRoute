"use client";

import { setCredentials } from "@/feature/user/userSlice";

import { useLogInMutation } from "@/redux/api/auth/authApi";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


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
  const [errors, setErrors] = useState<FormErrors>({});
  const [signIn, { isLoading }] = useLogInMutation();
  const [error, setError] = useState("")
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ general: "Please enter both email and password." });
      return;
    }

    try {
      const response = await signIn({ email, password }).unwrap();

      // console.log("Login response:", response);

      const result = response?.data?.result as { accessToken: string };

      if (!result?.accessToken) {
        throw new Error("No access token received from server");
      }

      const accessToken = result.accessToken;

      // ── rest of your code stays the same ──
      let userFromToken: UserProfile = {
        id: "",
        email,
        name: email.split("@")[0],
        role: undefined,
      };

      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        userFromToken = {
          id: payload.userId || payload.id || "", // ← note: your token has "userId", not "id"
          email: payload.email || email,
          name: payload.name || email.split("@")[0],
          role: payload.role,
        };
      } catch (decodeError) {
        console.warn("JWT decode failed, using fallback", decodeError);
      }

      dispatch(
        setCredentials({
          user: userFromToken,
          accessToken, // ← consistent naming
        }),
      );

      toast.success("Login successfully");
      // console.log("Logged in user:", userFromToken);

      if (userFromToken?.role === "ADMIN" || userFromToken?.role === "SUPERADMIN" || userFromToken?.role === "SUPER_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage =
        err?.data?.message || "Invalid email or password. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div>

      <div className="md:h-[calc(84vh-1rem)] flex items-center justify-center p-4 poppins-regular">
        <div className=" w-full max-w-2xl gap-2 overflow-hidden  ">
          {/* Right: Form */}
          <div className="flex flex-col justify-center p-6 my-12 shadow-lg md:mx-24 rounded-2xl">
            <div className="mb-6 ">
              <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
              <p className="mt-4 text-sm text-black">
                Log in to continue your application
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="block w-full py-3 pl-12 pr-4 text-gray-700 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="block w-full py-3 pl-12 pr-12 text-gray-700 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="/forgot-password" className="text-sm font-semibold ">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006CF9]  text-white gap-4 font-semibold py-3 px-4 rounded-full flex justify-center items-center cursor-pointer transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Login"}
                <span>
                  <ArrowRight />
                </span>
              </button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don&#39;t have an account?{" "}
                <Link href="/sign-up" className="font-semibold text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>

              <p className="mt-4">
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  ← Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
