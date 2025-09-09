import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchTodoProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchTodo({ value, onChange }: SearchTodoProps) {
    return (
        <div className="mb-4 ml-2 w-full">
            <Input
                placeholder="Search tasks..."
                prefix={<SearchOutlined />}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                allowClear
            />
        </div>
    );
}
