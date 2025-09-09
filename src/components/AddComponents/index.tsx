import { Input, Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useTodoStore } from "@/stores/todoStore";
import { PlusCircleTwoTone } from "@ant-design/icons";
import React, { useState } from "react";
import { NotificationInstance } from "antd/es/notification/interface";

interface InputAddProps {
  notify: NotificationInstance;
}

const { Option } = Select;

export default function InputAdd({ notify }: InputAddProps) {
  const { addTodo } = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
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
      <Select value={priority} onChange={(val) => setPriority(val)} style={{ width: 240 }}>
        <Option value="Low">Low</Option>
        <Option value="Medium">Medium</Option>
        <Option value="High">High</Option>
        <Option value="Critical">Critical</Option>
      </Select>
      <Button
        color="blue"
        variant="solid"
        onClick={handleAdd}
        icon={<PlusCircleTwoTone />}
        className="hover:scale-115"
      >Add</Button>
    </div>
  );
}

