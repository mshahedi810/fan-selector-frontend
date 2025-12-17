"use client"; // <- اضافه کن

import Home from "@/components/Home";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Home
        onNavigate={(page) => {
          router.push(`/${page}`); // navigate to admin, login, etc.
        }}
      />
    </div>
  );
}
