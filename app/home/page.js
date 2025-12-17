"use client"

import Home from "@/components/Home";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  return (
    <Home onNavigate={(page) => router.push(`/${page}`)} />
  );
}
