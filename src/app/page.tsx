"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/api/BackendApi/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/auth");
        return;
      }

      try {
        await api.get("/auth/username");
        router.replace("/todo");
      } catch {
        localStorage.removeItem("token");
        router.replace("/auth");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-300 via-white to-blue-300">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-6 text-red-500 text-xl font-semibold tracking-wide drop-shadow-lg">
        Đang kiểm tra đăng nhập...
      </p>
    </div>
  );
}
