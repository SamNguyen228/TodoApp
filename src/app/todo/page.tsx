"use client";

import React, { useState } from "react";
import Filter from "@/components/Filter";
import InputAdd from "@/components/Add";
import Action from "@/components/Action";
import ListTodo from "@/components/ListTodo";
import EditModal from "@/components/EditModal";
import WeatherWidget from "@/components/WeatherWidget";
import { notification } from "antd";
import SearchTodo from "@/components/SearchBar";
import { useTodoStore } from "@/stores/todoStore";
import { FaReact } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarouselBackground from "@/components/CarouselBackground";

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
      {contextHolder}
      <Header notify={api} />

      <div className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-300 via-white to-blue-300 pt-20 overflow-hidden">
        <CarouselBackground />

        <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
          <div className="flex items-center justify-center gap-4 text-red-400">
            <FaReact className="text-5xl reactIcon" />
            <h1 className="text-4xl font-bold text-center">Todo App</h1>
          </div>

          <WeatherWidget notify={api} />
          <hr className="text-gray-200" /> <br />
          <InputAdd notify={api} />
          <div className="flex justify-between items-center">
            <Filter />
            <SearchTodo value={searchTerm} onChange={handleSearch} />
          </div>
          <Action notify={api} />
          <ListTodo notify={api} />
          <EditModal notify={api} />
        </div>
      </div>

      <Footer />
    </>
  );
}
