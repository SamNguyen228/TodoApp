import React, { useState } from "react";
import { Input, Button } from "antd";
import { useTodoStore } from "@/stores/todoStore";
import { PlusCircleTwoTone } from "@ant-design/icons";

export default function InputAdd() {
  const {
    addTodo,
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState("");
  const handleAdd = () => {
    if (!newTodo.trim()) return alert("Vui lòng nhập công việc!");
    addTodo(newTodo);
    setNewTodo("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Nhập công việc..."
        onPressEnter={handleAdd}
        autoFocus
      />
      <Button color="blue" variant="solid" onClick={handleAdd} icon={<PlusCircleTwoTone />}  className="hover:scale-125"></Button>
    </div>
  );
}
