import { Input, Button, DatePicker, Select } from "antd";
import type { SelectProps } from "antd";
import dayjs from "dayjs";
import { useTodoStore, type Priority } from "@/stores/todoStore";
import { PlusCircleTwoTone } from "@ant-design/icons";
import React, { useState } from "react";
import { NotificationInstance } from "antd/es/notification/interface";

interface InputAddProps {
  notify: NotificationInstance;
}

const priorityOptions: SelectProps<Priority>["options"] = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: <span className="text-red-500 font-semibold">Critical</span> },
];

export default function InputAdd({ notify }: InputAddProps) {
  const { addTodo } = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);

  const handleAdd = () => {
    if (!newTodo.trim()) {
      notify.warning({
        message: "Warning",
        description: "Please fill your task!",
      });
      return;
    }
    notify.success({
      message: "Success",
      description: "Task has been added successfully!",
    });
    addTodo(newTodo, deadline ? deadline.toISOString() : null, priority);
    setNewTodo("");
    setDeadline(null);
    setPriority("Medium");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new task..."
        onPressEnter={handleAdd}
        autoFocus
      />
      <DatePicker
        value={deadline}
        onChange={(value) => setDeadline(value)}
        showTime
        format="DD-MM-YYYY HH:mm"
        placeholder="Deadline"
        className="w-100"
      />
      <Select
        value={priority}
        onChange={(val) => setPriority(val)}
        options={priorityOptions}
        style={{ width: 240 }}
      />
      <Button
        color="blue"
        variant="solid"
        onClick={handleAdd}
        icon={<PlusCircleTwoTone />}
        className="hover:scale-115"
      >
        Add
      </Button>
    </div>
  );
}
