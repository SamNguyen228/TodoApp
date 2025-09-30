import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";

interface SearchTodoProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchTodo({ value, onChange }: SearchTodoProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState(value);
  const debounced = useDebounce(internal, 500);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    if (debounced !== value) {
      onChange(debounced);
    }
  }, [debounced]);

  return (
    <div className="mb-4 ml-2 w-full">
      <Input
        placeholder={t("search.search_placeholder")}
        prefix={<SearchOutlined />}
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        allowClear
      />
    </div>
  );
}
