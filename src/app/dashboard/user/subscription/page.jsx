"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Zap, Award } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const SubscriptionSkeleton = () => {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="space-y-2 text-center max-w-md mx-auto">
        <div className="h-8 bg-stone-200 rounded-lg w-3/4 mx-auto animate-pulse" />
        <div className="h-4 bg-stone-200 rounded-lg w-full mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white rounded-[2.5rem] p-8 border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-[460px]"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-5 bg-stone-200 rounded-md w-24 animate-pulse" />
                <div className="h-8 bg-stone-200 rounded-md w-32 animate-pulse" />
              </div>
              <div className="h-12 bg-stone-200 rounded-md w-28 animate-pulse" />
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-stone-200 rounded-md w-5/6 animate-pulse" />
                <div className="h-4 bg-stone-200 rounded-md w-4/5 animate-pulse" />
                <div className="h-4 bg-stone-200 rounded-md w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="h-12 bg-stone-200 rounded-xl w-full mt-8 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

const UserSubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [currentPlan, setCurrentPlan] = useState(
    session?.user?.subscription?.plan || "free",
  );

  useEffect(() => {
    if (session?.user?.subscription?.plan) {
      setCurrentPlan(session.user.subscription.plan);
    }
  }, [session]);

  const handleSubscription = async (plan) => {
    if (!session?.user?.id) {
      toast.error("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout/subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            plan: plan,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL is missing");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const subscriptionTiers = [
    {
      id: "free",
      name: "Salon Visitor",
      badge: "Standard",
      price: "$0",
      period: "monthly",
      limit: "3 masterpiece purchases",
      features: [
        "Access to public exhibition salons",
        "Personal art collector dossier",
        "Public guestbook reviews",
        "Standard digital verification",
      ],
      icon: <Zap className="w-5 h-5 text-stone-600" />,
      isPopular: false,
    },
    {
      id: "pro",
      name: "Patron Guild",
      badge: "Curator's Choice",
      price: "$9.99",
      period: "monthly",
      limit: "9 masterpiece purchases",
      features: [
        "Expanded acquisition quota (9 pieces)",
        "Priority curatorial consultation",
        "Private salon exhibition previews",
        "Direct artist studio messaging",
      ],
      icon: <Sparkles className="w-5 h-5 text-[#B4136D]" />,
      isPopular: true,
    },
    {
      id: "premium",
      name: "Master Patron",
      badge: "Collector Elite",
      price: "$19.99",
      period: "monthly",
      limit: "Unlimited acquisitions",
      features: [
        "Unlimited masterpiece acquisitions",
        "Verified Master Patron guild badge",
        "VIP physical certificates of provenance",
        "Private salon pre-launch access",
      ],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      isPopular: false,
    },
  ];

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-[#FAF8F5] font-sans text-stone-900">
      {/* PAGE HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mx-auto">
          <Award className="w-3.5 h-3.5" />
          <span>Collector Guild</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-stone-900">
          Patron Memberships
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm md:text-base leading-relaxed">
          Elevate your acquisition tier to collect fine artwork without restriction and support global independent masters.
        </p>
      </div>

      {/* RESPONSIVE CARDS GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-4"
      >
        {subscriptionTiers.map((tier) => {
          const isCurrent = currentPlan === tier.id;

          const isDisabled =
            tier.id === "free" ||
            isCurrent ||
            (currentPlan === "premium" && tier.id === "pro");

          const buttonText = isCurrent
            ? "Current Tier"
            : tier.id === "free"
              ? "Default Tier"
              : tier.id === "pro"
                ? "Upgrade to Patron Guild"
                : "Become Master Patron";

          return (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              className={`relative bg-white rounded-[2.5rem] p-7 md:p-9 flex flex-col justify-between transition-all duration-300 border ${
                tier.isPopular
                  ? "border-[#B4136D] shadow-xl shadow-[#B4136D]/10 ring-1 ring-[#B4136D]"
                  : "border-stone-200/90 shadow-2xs hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              <div className="absolute top-7 right-7">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    isCurrent
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : tier.isPopular
                        ? "bg-[#B4136D]/10 text-[#B4136D] border border-[#B4136D]/20"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {isCurrent ? "Active Tier" : tier.badge}
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div
                    className={`p-3 w-fit rounded-2xl ${
                      tier.id === "free"
                        ? "bg-stone-100"
                        : tier.id === "pro"
                          ? "bg-[#B4136D]/10"
                          : "bg-emerald-50"
                    }`}
                  >
                    {tier.icon}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline text-stone-900">
                  <span className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-1.5 text-xs font-medium text-stone-400">
                    /{tier.period}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border text-xs font-semibold ${
                    tier.isPopular
                      ? "bg-[#B4136D]/5 border-[#B4136D]/20 text-[#B4136D]"
                      : "bg-stone-50 border-stone-200/80 text-stone-700"
                  }`}
                >
                  Quota Limit: {tier.limit}
                </div>

                <ul className="space-y-3 pt-2">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 leading-snug"
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          tier.isPopular ? "text-[#B4136D]" : "text-stone-400"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscription(tier.id)}
                disabled={isDisabled}
                className={`w-full mt-8 py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isDisabled
                    ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                    : tier.isPopular
                      ? "bg-[#B4136D] hover:bg-[#930f58] text-white border-[#B4136D] shadow-md shadow-[#B4136D]/20 active:scale-98"
                      : "bg-stone-900 hover:bg-stone-800 text-white border-stone-900 shadow-sm active:scale-98"
                }`}
              >
                {buttonText}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default UserSubscriptionPage;
