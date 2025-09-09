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
    <div className="mb-4 w-full">
      <Select
        value={filter}
        onChange={(val) => setFilter(val)}
        className="w-full"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Incomplete" },
          { value: "completed", label: "Completed" },
        ]}
      />
    </div>
  );
}
