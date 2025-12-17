"use client"
import Header from "./Header";
import { useRouter } from "next/navigation";

export default function HeaderClientWrapper() {
  const router = useRouter();

  return (
    <Header onNavigate={(page) => router.push(`/${page}`)} />
  );
}
