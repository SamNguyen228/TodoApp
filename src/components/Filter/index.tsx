import React from "react";
import { Select } from "antd";
import { useTodoStore } from "@/stores/todoStore";
import { useTranslation } from "react-i18next";

export default function Filter() {
  const { filter, setFilter } = useTodoStore();
  const { t } = useTranslation();
  return (
    <div className="mb-4 w-full">
      <Select
        value={filter}
        onChange={(val) => setFilter(val)}
        className="w-full"
        options={[
          { value: "all", label: t("filter.all") },
          { value: "active", label: t("filter.active") },
          { value: "completed", label: t("filter.completed") },
          { value: "expired", label: t("filter.expired") },
        ]}
      />
    </div>
  );
}
