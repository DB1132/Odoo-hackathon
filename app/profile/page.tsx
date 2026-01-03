"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ProfilePage } from "@/components/profile-page";
import { PageChrome } from "@/components/page-chrome";
import { UserRound } from "lucide-react";

export default function Profile() {
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
    <PageChrome title="Profile" subtitle="Manage your personal details" icon={<UserRound className="w-5 h-5" />}>
      <ProfilePage />
    </PageChrome>
  );
}
