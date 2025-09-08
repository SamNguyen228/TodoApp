import React from "react";
import { Select } from "antd";
import { useTodoStore } from "@/stores/todoStore";

export default function Filter() {
  const {
    filter,
    setFilter,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useTodoStore();
  return (
    <div className="mb-4">
      <Select
        value={filter}
        onChange={(val) => setFilter(val)}
        className="w-full"
        options={[
          { value: "all", label: "Tất cả" },
          { value: "active", label: "Chưa hoàn thành" },
          { value: "completed", label: "Đã hoàn thành" },
        ]}
      />
    </div>
  );
}
