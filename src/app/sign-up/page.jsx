"use client";
import React, { useState, useRef, useEffect } from "react";
import signupimg from "../../../public/Assets/Signup.png";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  ShoppingBag,
  Palette,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

const SignUpPage = () => {
  // States
  const [role, setRole] = useState("collector");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session, isPending } = useSession();

  // Redirect if already signed in
  useEffect(() => {
    if (!isPending && session) {
      const userRole = session.user?.role;
      if (userRole === "admin") {
        router.replace("/dashboard/admin");
      } else if (userRole === "artist") {
        router.replace("/dashboard/artist");
      } else {
        router.replace("/");
      }
    }
  }, [session, isPending, router]);

  // Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { text: "", color: "", bgColor: "" };
    if (pass.length < 8)
      return {
        text: "Weak (Min 8 chars)",
        color: "text-rose-600",
        bgColor: "bg-rose-50 border border-rose-200",
      };

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
    if (strongRegex.test(pass)) {
      return {
        text: "Strong Security",
        color: "text-emerald-700",
        bgColor: "bg-emerald-50 border border-emerald-200",
      };
    }
    return {
      text: "Adequate Password",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border border-amber-200",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  // Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      setImageFile(file);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name!");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address!");
      return;
    }
    if (!password) {
      toast.error("Please create a password!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();
        if (data.success) {
          imageUrl = data.data.url;
        } else {
          toast.error(
            "Profile picture upload failed. Continuing with default avatar.",
          );
        }
      }

      const resolvedRole = role === "collector" ? "user" : "artist";

      const { data, error } = await signUp.email({
        email,
        password,
        name,
        image: imageUrl || undefined,
        role: resolvedRole,
      });

      if (error) {
        toast.error(error.message || "Failed to create account!");
      } else {
        toast.success("Account created successfully! Please sign in.", {
          position: "top-right",
        });
        router.push("/sign-in");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during account registration!");
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.06,
      },
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
      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1140px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-stone-200/90 flex flex-col md:flex-row overflow-hidden items-stretch"
      >
        {/* Exhibition Imagery Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:flex w-1/2 relative p-3 items-stretch self-stretch"
        >
          <div className="relative w-full min-h-full rounded-[2rem] overflow-hidden shadow-inner flex bg-stone-100">
            <Image
              src={signupimg}
              alt="Curated Digital Asset"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
              className="transition-transform duration-700 hover:scale-105"
            />

            {/* Top Tooltip */}
            <div className="absolute top-6 left-6 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 z-10 select-none">
              <span className="mr-1.5 text-amber-400">✦</span>
              Curated Fine Art Guild
            </div>

            {/* Bottom Plaque */}
            <div className="absolute bottom-6 left-6 right-6 bg-stone-900/75 backdrop-blur-xl p-5 rounded-[1.4rem] border border-white/15 flex items-center justify-between text-white shadow-xl z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#B4136D] flex items-center justify-center shadow-md text-white shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight font-serif">
                    Join Global Collectors & Masters
                  </p>
                  <p className="text-[11px] text-stone-300">
                    Acquire original works and showcase exhibitions worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16 self-center">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[11px] font-bold uppercase tracking-widest mb-3">
                <Sparkles size={12} className="text-[#B4136D]" />
                <span>Patronage & Exhibition</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight mb-2">
                Begin Your Journey
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                Join our international community of art lovers, verified curators, and artists.
              </p>
            </motion.div>

            {/* Role Selector */}
            <motion.div
              variants={itemVariants}
              className="p-1 bg-[#FAF8F5] rounded-2xl flex gap-1 mb-5 border border-stone-200 relative"
            >
              <button
                type="button"
                onClick={() => setRole("collector")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 cursor-pointer ${
                  role === "collector"
                    ? "text-[#B4136D]"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <ShoppingBag size={14} />
                <span>I am a Collector</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("artist")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 cursor-pointer ${
                  role === "artist"
                    ? "text-[#B4136D]"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Palette size={14} />
                <span>I am an Artist</span>
              </button>

              {/* Animated Sliding Pill */}
              <motion.div
                className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-xs border border-stone-200"
                initial={false}
                animate={{
                  left: role === "collector" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </motion.div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSignUp}>
              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 tracking-wider uppercase">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 group-focus-within:text-[#B4136D] transition-colors">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Vincent Willem"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 placeholder:text-stone-400 font-medium"
                    required
                  />
                </div>
              </motion.div>

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
                    className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 placeholder:text-stone-400 font-medium"
                    required
                  />
                </div>
              </motion.div>

              {/* Profile Image Upload */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 tracking-wider uppercase">
                  Profile Portrait (Optional)
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                    {imagePreview ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-[#B4136D] shadow-2xs relative">
                        <Image
                          src={imagePreview}
                          alt="Icon Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <ImageIcon
                        size={16}
                        className="group-focus-within:text-[#B4136D] transition-colors"
                      />
                    )}
                  </span>

                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-full pl-11 pr-24 py-2.5 sm:py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-between text-stone-400 select-none hover:border-stone-300 focus-within:ring-3 focus-within:ring-[#B4136D]/10 shadow-2xs font-medium"
                  >
                    <span
                      className={
                        imagePreview
                          ? "text-stone-800 truncate max-w-[140px] sm:max-w-[180px]"
                          : "text-sm text-stone-400"
                      }
                    >
                      {imagePreview ? imageName : "Upload portrait picture"}
                    </span>

                    <span className="absolute right-2 top-1.5 bottom-1.5 bg-white text-stone-700 border border-stone-200 font-semibold text-xs px-3 flex items-center rounded-lg hover:bg-stone-50 transition-colors shadow-2xs">
                      Browse
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".png, .jpg, .jpeg, .webp"
                    onChange={handleImageChange}
                    className="hidden"
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
                    className="w-full pl-11 pr-12 py-2.5 sm:py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 font-medium placeholder:text-stone-300"
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
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${passwordStrength.color} ${passwordStrength.bgColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{passwordStrength.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 tracking-wider uppercase">
                  Confirm Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 group-focus-within:text-[#B4136D] transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-2.5 sm:py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl focus:outline-none focus:border-[#B4136D] focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 text-sm transition-all text-stone-900 font-medium placeholder:text-stone-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {confirmPassword && password !== confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Passwords do not match</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-stone-300 text-[#B4136D] focus:ring-[#B4136D]/30 accent-[#B4136D] cursor-pointer transition-all"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs font-medium text-stone-600 cursor-pointer select-none"
                >
                  I accept the{" "}
                  <span className="text-[#B4136D] font-bold hover:underline">
                    Patron Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-[#B4136D] font-bold hover:underline">
                    Provenance Policies
                  </span>
                </label>
              </motion.div>

              {/* Create Account Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-[#B4136D]/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>
                    {loading ? "Creating Member Account..." : "Create Account"}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            </form>

            {/* Sign In Link */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center text-xs font-medium text-stone-500"
            >
              Already registered with ArtHub?{" "}
              <Link
                href="/sign-in"
                className="text-[#B4136D] font-bold hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;