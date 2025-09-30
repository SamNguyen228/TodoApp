"use client";

import React from "react";
import { Layout, Typography, Space } from "antd";
import { FaListCheck } from "react-icons/fa6";
import Language from "../Language";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const { Text } = Typography;

export default function AuthHeader() {
  const { t } = useTranslation();
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
            {t("title.app_name")}
          </Text>
        </Space>
        <Space align="center">
          <Language />
        </Space>
      </Header>
    </>
  );
}
