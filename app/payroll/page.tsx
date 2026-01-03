"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PayslipsPage } from "@/components/payslips-page";
import { PageChrome } from "@/components/page-chrome";
import { Receipt } from "lucide-react";

export default function Payroll() {
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
    <PageChrome title="Salary" subtitle="View your payroll details" icon={<Receipt className="w-5 h-5" />}>
      <PayslipsPage />
    </PageChrome>
  );
}
