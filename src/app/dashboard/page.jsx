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
    <div className="min-h-screen bg-[#FAF8F5] p-6 animate-pulse select-none">
      {/* Welcome Banner Skeleton */}
      <div className="bg-white border border-stone-200/80 rounded-[2rem] p-8 flex justify-between items-center h-[240px] shadow-2xs">
        <div className="space-y-4">
          <div className="h-8 bg-stone-200/80 rounded-xl w-56" />
          <div className="h-4 bg-stone-200/70 rounded-md w-96 max-w-full" />
          <div className="h-4 bg-stone-200/60 rounded-md w-72 max-w-full" />
          <div className="h-10 bg-stone-200/80 rounded-full w-40 mt-4" />
        </div>
        <div className="hidden md:block w-48 h-48 rounded-[1.6rem] bg-stone-200/70" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-stone-200/80 shadow-2xs space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-stone-200/80" />
              <div className="h-5 w-20 rounded-full bg-stone-200/70" />
            </div>
            <div className="space-y-2.5">
              <div className="h-3.5 w-28 rounded bg-stone-200/70" />
              <div className="h-8 w-24 rounded bg-stone-200/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRedirectPage;