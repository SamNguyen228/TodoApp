import { create } from "zustand";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  autoCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  deadline?: string | null;
  priority: Priority;
  expired?: boolean;
}

export interface EditingTodo {
  id: number;
  title: string;
  deadline: string | null;
  priority: Priority;
}

interface TodoState {
  filter: "all" | "completed" | "active" | "expired";
  selectedIds: number[];
  editing: EditingTodo | null;
  search: string;

  currentPage: number;
  pageSize: number;

  sortField: string;
  sortOrder: "ascend" | "descend" | null;

  setSearch: (val: string) => void;
  setFilter: (filter: "all" | "completed" | "active" | "expired") => void;
  setSelectedIds: (ids: number[]) => void;
  toggleSelect: (id: number, checked: boolean) => void;
  setEditing: (todo: EditingTodo | null) => void;

  setSort: (field: string, order: "ascend" | "descend" | null) => void;
  setPagination: (page: number, size: number) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  filter: "all",
  selectedIds: [],
  editing: null,
  search: "",

  currentPage: 1,
  pageSize: 5,

  sortField: "createdAt",
  sortOrder: null,

  setSearch: (val) => set({ search: val }),

  setFilter: (filter) => set({ filter }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  toggleSelect: (id, checked) =>
    set((state) => ({
      selectedIds: checked
        ? [...state.selectedIds, id]
        : state.selectedIds.filter((i) => i !== id),
    })),

  setEditing: (todo) => set({ editing: todo }),

  setSort: (field, order) => set({ sortField: field, sortOrder: order }),

  setPagination: (page, size) => set({ currentPage: page, pageSize: size }),
}));
