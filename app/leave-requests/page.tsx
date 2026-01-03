"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LeavePage } from "@/components/leave-page";
import { PageChrome } from "@/components/page-chrome";
import { CalendarCheck } from "lucide-react";

export default function LeaveRequests() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <PageChrome title="Leave Requests" subtitle="Apply for and track your leaves" icon={<CalendarCheck className="w-5 h-5" />}>
      <LeavePage />
    </PageChrome>
  );
}
