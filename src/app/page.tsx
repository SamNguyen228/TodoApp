"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/api/BackendApi/api";
import { Spin, Typography } from "antd";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await api.get("/auth/username");
        router.replace("/todo");
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-300 via-white to-blue-300">
      <Spin size="large" tip="Đang kiểm tra đăng nhập..." />

      <Typography.Text type="danger" className="mt-4 text-lg font-semibold">
        Vui lòng chờ trong giây lát...
      </Typography.Text>
    </div>
  );
}
