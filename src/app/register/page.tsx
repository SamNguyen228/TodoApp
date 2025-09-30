"use client"

import RegisterForm from "@/components/Auth/Register"
import { notification } from "antd";

export default function RegisterPage() {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <RegisterForm notify={api} />
    </>
  );
}
