"use client";

import { useTranslation } from "react-i18next";

export const Translation = () => {
  const { t, i18n } = useTranslation();
  return { t, i18n };
};
