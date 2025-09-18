"use client"

import AuthForm from "@/components/Auth";
import { notification } from "antd";

export default function LoginPage() {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <AuthForm notify={api} />
    </>
  );
}
