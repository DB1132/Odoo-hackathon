"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AttendancePage } from "@/components/attendance-page";
import { PageChrome } from "@/components/page-chrome";
import { Clock } from "lucide-react";

export default function Attendance() {
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
    <PageChrome title="Attendance" subtitle="View and manage your attendance" icon={<Clock className="w-5 h-5" />}>
      <AttendancePage />
    </PageChrome>
  );
}
