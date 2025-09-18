import { Todo } from "@/stores/todoStore";
import api from "./api"

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

export const todoApi = {
  getTodos: async () => {
    const res = await api.get("/todos");
    console.log("todos raw:", res.data);
    return res.data;
  },

  createTodo: async (
    title: string,
    deadline: string | null,
    priority: string
  ) => {
    const res = await api.post("/todos", { title, deadline, priority });
    return res.data;
  },

  updateTodo: async (id: number, data: Partial<Todo>) => {
    const res = await api.put(`/todos/${id}`, data);
    return res.data as Todo;
  },

  deleteTodo: async (id: number) => {
    await api.delete(`/todos/${id}`);
  },

  autoCompleteOverdue: async () => {
    const res = await api.put("/todos/auto-complete");
    return res.data;
  },
};
