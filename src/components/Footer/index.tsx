"use client";

import React from "react";
import { Layout, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;
const { Text } = Typography;

export default function AppFooter() {
  const { t } = useTranslation();
  return (
    <Footer className="bg-gray-300 backdrop-blur-md shadow-md p-4 w-full" >
      <div className="text-center" >
        <Text className="text-gray-700">
          &copy; {t("footer.year")} <span className="font-semibold">{t("footer.name")}</span>. {t("footer.copy_right")}
        </Text>
      </div>
    </Footer>
  );
}
