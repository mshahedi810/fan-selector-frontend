"use client";

import AdminLogin from "@/components/AdminLogin";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/admin");
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
