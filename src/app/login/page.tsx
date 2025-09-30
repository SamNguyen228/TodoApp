"use client"

import LoginForm from "@/components/Auth/Login";
import { notification } from "antd";

export default function LoginPage() {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <LoginForm notify={api} />
    </>
  );
}
