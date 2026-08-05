"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CookIngredientsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cook");
  }, [router]);

  return <p className="p-10 text-[#D17368]">Opening cook mode...</p>;
}
