"use client";

import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import viVN from "antd/locale/vi_VN";
import jaJP from "antd/locale/ja_JP";
import deDE from "antd/locale/de_DE";

interface LocalizedDatePickerProps {
  value?: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  placeholder?: string;
  showTime?: boolean;
  format?: string;
  className?: string;
}

export default function LocalizedDatePicker({
  value,
  onChange,
  placeholder,
  showTime = true,
  format = "DD-MM-YYYY HH:mm",
  className,
}: LocalizedDatePickerProps) {
  const { i18n } = useTranslation();

  let locale;
  switch (i18n.language) {
    case "vi":
      locale = viVN;
      break;
    case "ja":
      locale = jaJP;
      break;
    case "de":
      locale = deDE;
      break;
    default:
      locale = undefined; 
  }

  return (
    <ConfigProvider locale={locale}>
      <DatePicker
        showTime={showTime}
        format={format}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </ConfigProvider>
  );
}
