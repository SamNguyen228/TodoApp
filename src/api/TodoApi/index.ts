import axiosClient from "@/api/axiosClient";
import type { Todo } from "@/stores/todoStore";

export const TodoApi = {
  getTodos: async (
    page: number,
    size: number,
    filter: string,
    search: string,
    sortField: string,
    sortOrder: "ascend" | "descend" | null
  ) => {
    const res = await axiosClient.get("/todos", {
      params: { page, size, filter, search, sortField, sortOrder },
    });
    return res.data as {
      content: Todo[];
      currentPage: number;
      totalElements: number;
    };
  },

  createTodo: async (
    title: string,
    deadline: string | null,
    priority: string
  ) => {
    const res = await axiosClient.post("/todos", { title, deadline, priority });
    return res.data as Todo;
  },

  updateTodo: async (id: number, data: Partial<Todo>) => {
    const res = await axiosClient.put<Todo>(`/todos/${id}`, data);
    return res.data;
  },

  deleteTodo: async (id: number) => {
    await axiosClient.delete(`/todos/${id}`);
  },

  autoCompleteOverdue: async () => {
    const res = await axiosClient.put("/todos/auto-complete");
    return res.data;
  },

  deleteMany: async (ids: number[]) => {
    await axiosClient.delete("/todos/batch", { data: ids });
  },

  completeMany: async (ids: number[]) => {
    const res = await axiosClient.put("/todos/batch/complete", ids);
    return res.data;
  },
};

export default TodoApi;


