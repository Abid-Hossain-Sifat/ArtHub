"use client";
import React, { useState, useEffect, Suspense } from "react";
import SignInImg from "../../../public/Assets/Login.png";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const SignInPageContent = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      const redirect = searchParams.get("redirect");

      if (redirect) {
        router.replace(redirect);
        return;
      }

      const role = session.user?.role;

      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "artist") {
        router.replace("/dashboard/artist");
      } else {
        router.replace("/");
      }
    }
  }, [session, isPending, router, searchParams]);

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password!");
      return;
    }

    setLoading(true);
    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed in!");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                "Failed to sign in. Please check your credentials.",
            );
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during sign in!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/sign-in`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed!");
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isPending) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-3 border-[#B4136D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex items-center justify-center font-sans antialiased py-8 sm:py-14 md:py-20 px-4 selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      {/* Main Container Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1140px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-stone-200/90 flex flex-col md:flex-row overflow-hidden items-stretch"
      >
        {/* Form Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16 self-center order-2 md:order-1">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[11px] font-bold uppercase tracking-widest mb-3">
                <Sparkles size={12} className="text-[#B4136D]" />
                <span>Collector & Artist Portal</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight mb-2 text-left">
                Welcome Back
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm font-normal text-left leading-relaxed">
                Enter your credentials to access your curated gallery collection and acquisitions.
              </p>
            </motion.div>

            {/* Input Form Fields */}
            <form className="space-y-4" onSubmit={handleSignIn}>
              {/* Email Address */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 tracking-wider uppercase">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 group-focus-within:text-[#B4136D] transition-colors">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 placeholder:text-stone-400 font-medium"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 tracking-wider uppercase">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 group-focus-within:text-[#B4136D] transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 font-medium placeholder:text-stone-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Sign In Button */}
              <motion.div variants={itemVariants} className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-[#B4136D]/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{loading ? "Verifying Credentials..." : "Sign In to ArtHub"}</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center my-5"
            >
              <div className="flex-1 border-t border-stone-200"></div>
              <span className="px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-1 border-t border-stone-200"></div>
            </motion.div>

            {/* Google Login Button */}
            <motion.div variants={itemVariants} className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-2xs cursor-pointer"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.91 11.91 0 0 0 12 .5c-4.81 0-8.995 2.845-10.96 6.977l4.226 2.288z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M1.04 14.523A11.854 11.854 0 0 0 1.04 9.477L5.266 11.76a7.065 7.065 0 0 1 0 2.48l-4.226 2.283z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 19.091a7.066 7.066 0 0 1-4.418-1.582L3.336 21A11.91 11.91 0 0 0 12 23.5c3.264 0 6.255-1.091 8.614-2.955l-4.14-3.527a7.042 7.042 0 0 1-4.474 2.073z"
                  />
                  <path
                    fill="#34A853"
                    d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.51h6.464a5.525 5.525 0 0 1-2.4 3.618l4.14 3.527c2.418-2.227 3.887-5.505 3.887-9.282z"
                  />
                </svg>
                Continue with Google
              </button>
            </motion.div>

            {/* SignUp Page Link */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center text-xs font-medium text-stone-500"
            >
              Don't have an ArtHub account?{" "}
              <Link
                href="/sign-up"
                className="text-[#B4136D] font-bold hover:underline transition-colors ml-1"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Exhibition Imagery Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:flex w-1/2 relative p-3 items-stretch self-stretch order-1 md:order-2"
        >
          <div className="relative w-full min-h-full rounded-[2rem] overflow-hidden shadow-inner flex bg-stone-100">
            <Image
              src={SignInImg}
              alt="ArtHub Security Hub"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
              className="transition-transform duration-700 hover:scale-105"
            />

            {/* Top Badge */}
            <div className="absolute top-6 right-6 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 z-10 select-none">
              <span className="mr-1.5 text-amber-400">✦</span>
              Fine Art Registry
            </div>

            {/* Bottom Plaque */}
            <div className="absolute bottom-6 left-6 right-6 bg-stone-900/75 backdrop-blur-xl p-5 rounded-[1.4rem] border border-white/15 flex items-center justify-between text-white shadow-xl z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#B4136D] flex items-center justify-center shadow-md text-white shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight font-serif">
                    The ArtHub Gallery Exchange
                  </p>
                  <p className="text-[11px] text-stone-300">
                    Connecting vanguard creators with global art patrons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-10 h-10 border-3 border-[#B4136D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
};

export default SignInPage;
