"use client";

import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

export default function AppFooter() {
  return (
    <Footer className="bg-gray-300 backdrop-blur-md shadow-md p-4 w-full" >
      <div className="text-center" >
        <Text className="text-gray-700">
          &copy; 2025 <span className="font-semibold">Sam Dev</span>. All rights reserved.
        </Text>
      </div>
    </Footer>
  );
}
