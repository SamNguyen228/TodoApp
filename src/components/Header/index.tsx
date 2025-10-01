"use client";

import React, { useEffect, useState } from "react";
import { Layout, Button, Typography, Space, Popconfirm } from "antd";
import { FaListCheck } from "react-icons/fa6";
import { MdLogout, MdLogin } from "react-icons/md";
import { getUsername } from "@/api/BackendApi/auth";
import Link from "next/link";
import { NotificationInstance } from "antd/es/notification/interface";
import Language from "../Language";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  notify: NotificationInstance;
}

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader({ notify }: HeaderProps) {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    getUsername()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    notify.success({
      message: t("notify.success"),
      description: t("notify.logout_success"),
    });
    window.location.href = "/login";
  };

  return (
    <>
      <Header
        className="fixed top-0 left-0 w-full z-20"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: "24px",
        }}
      >
        <Space align="center" direction="horizontal">
          <Link href="/" className="flex items-center gap-2">
            <FaListCheck className="text-2xl text-blue-500" />
            <span className="text-xl font-semibold text-gray-700">
              {t("title.app_name")}
            </span>
          </Link>
        </Space>

        {user ? (
          <Space align="center">
            <Text className="text-gray-600">
              {t("title.greet")},{" "}
              <b className="text-cyan-300">{user.username}</b>
            </Text>
            <Popconfirm
              title={t("prop_confirm.logout_confirm")}
              description={t("prop_confirm.logout_confirm_des")}
              onConfirm={handleLogout}
              okText={t("button.logout_ok")}
              cancelText={t("button.logout_cancel")}
              okButtonProps={{ danger: true }}
            >
              <Button danger type="primary" icon={<MdLogout />}>
                {t("button.logout")}
              </Button>
            </Popconfirm>

            <Language />
          </Space>
        ) : (
          <Link href="/">
            <Button type="primary" icon={<MdLogin />}>
              {t("button.login")}
            </Button>
          </Link>
        )}
      </Header>
    </>
  );
}
