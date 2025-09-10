"use client";

import React, { useState } from "react";
import Filter from "@/components/FilterComponents";
import InputAdd from "@/components/AddComponents";
import Action from "@/components/ActionComponents";
import ListTodo from "@/components/ListTodoComponents";
import EditModal from "@/components/EditModalComponents";
import { notification } from "antd";
import Icon from "@/components/IconComponents";
import SearchTodo from "@/components/SearchBarComponents";
import { useTodoStore } from "@/stores/todoStore";

export default function App() {
  const [api, contextHolder] = notification.useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const { setSearch } = useTodoStore();

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setSearch(val);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-6 w-screen bg-gradient-to-br from-pink-300 via-white to-blue-300">
        {contextHolder}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
          <h1 className="text-4xl font-bold mb-4 text-center text-red-400 animate-bounce">
            Todo App
          </h1>

          <InputAdd notify={api} />
          <div className="flex justify-between items-center">
            <Filter />
            <SearchTodo value={searchTerm} onChange={handleSearch} />
          </div>
          <Action notify={api} />
          <ListTodo notify={api} />
          <EditModal notify={api} />
        </div>
        <Icon />
      </div>
    </>
  );
}
