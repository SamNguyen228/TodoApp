"use client";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || i18n.language.split("-")[0] || "en"
  );

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const handleChange = (value: string) => {
    setLang(value);
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  const options = [
    { value: "en", label: t("language.english") },
    { value: "vi", label: t("language.vietnamese") },
    { value: "ja", label: t("language.japanese") },
    { value: "de", label: t("language.german") },
  ];

  return (
    <Select
      value={lang}
      style={{ width: 160 }}
      onChange={handleChange}
      options={options}
    />
  );
}
