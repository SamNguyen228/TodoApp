"use client";

import React from "react";
import Filter from "@/components/FilterComponents";
import InputAdd from '@/components/AddComponents';
import Action from "@/components/ActionComponents";
import ListTodo from "@/components/ListTodoComponents";
import EditModal from "@/components/EditModalComponents";
import { notification } from "antd";
import Icon from "@/components/IconComponents";

export default function App() {

  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        {/* contextHolder phải render trong JSX */}
        {contextHolder}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-red-400">
            Todo App
          </h1>

          <InputAdd />
          <Filter />
          <Action notify={api} />
          <ListTodo />
          <EditModal />
        </div>
        <Icon />
      </div>
    </>
  );
}
