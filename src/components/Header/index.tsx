"use client";

import React, { useEffect, useState } from "react";
import { Layout, Button, Typography, Space, Popconfirm } from "antd";
import { FaListCheck } from "react-icons/fa6";
import { MdLogout, MdLogin } from "react-icons/md";
import { getUsername } from "@/api/BackendApi/auth";
import Link from "next/link";
import { NotificationInstance } from "antd/es/notification/interface";

interface HeaderProps {
  notify: NotificationInstance;
}

const { Header } = Layout;
const { Text } = Typography;


export default function AppHeader({ notify }: HeaderProps) {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    getUsername()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    notify.success({
      message: "Success",
      description: "Logout Successful!"
    });
    window.location.href = "/";
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
        <Space align="center">
          <FaListCheck className="text-2xl text-blue-500" />
          <Text strong className="text-xl text-gray-700">
            TodoApp
          </Text>
        </Space>

        {user ? (
          <Space align="center">
            <Text className="text-gray-600">
              Hello, <b className="text-cyan-300 capitalize">{user.username}</b>
            </Text>
            <Popconfirm
              title="Confirm Logout"
              description="Are you sure you want to log out?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger type="primary" icon={<MdLogout />}>
                Logout
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Link href="/">
            <Button type="primary" icon={<MdLogin />}>
              Login
            </Button>
          </Link>
        )}
      </Header>
    </>
  );
}
