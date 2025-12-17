"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { FANS_DATA } from "@/data/fans";

export default function Page() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const expire = parseInt(localStorage.getItem("adminExpire"), 10);

    if (!isLoggedIn || !expire || Date.now() > expire) {
      router.push("/login");
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <AdminDashboard 
      fans={FANS_DATA || []} 
      onAddFan={(fan) => console.log("Add:", fan)}
      onUpdateFan={(fan) => console.log("Update:", fan)}
      onDeleteFan={(id) => console.log("Delete:", id)}
      onAddFansBatch={(newFans) => console.log("Batch Add:", newFans)}
    />
  );
}
