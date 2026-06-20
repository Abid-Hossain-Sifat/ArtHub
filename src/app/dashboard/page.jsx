"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const DashboardRedirectPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/sign-in");
      } else {
        const role = session.user?.role;
        if (role === "admin") {
          router.replace("/dashboard/admin");
        } else if (role === "artist") {
          router.replace("/dashboard/artist");
        } else if (role === "user") {
          router.replace("/dashboard/user");
        } else {
          router.replace("/unauthorized");
        }
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-slate-50 p-4 select-none">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Modern Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin"></div>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Routing to Dashboard
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Please wait while we redirect you to your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardRedirectPage;
