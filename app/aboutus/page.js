"use client";

import AboutUs from "@/components/AboutUs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <AboutUs
      onNavigate={(page) => router.push(`/${page}`)}
    />
  );
}
