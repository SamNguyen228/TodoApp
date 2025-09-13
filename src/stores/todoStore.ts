import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline?: string | null;
  priority: Priority;
  expired?: boolean;
}

export interface EditingTodo {
  id: number;
  text: string;
  deadline: string | null;
  priority: Priority;
}

interface TodoState {
  todos: Todo[];
  filter: "all" | "completed" | "active";
  selectedIds: number[];
  editing: EditingTodo | null;
  search: string;

  setSearch: (val: string) => void;
  addTodo: (text: string, deadline: string | null, priority: Priority) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string, deadline: string | null, priority: Priority) => void;
  deleteMany: (ids: number[]) => void;
  completeMany: (ids: number[]) => void;
  setFilter: (filter: "all" | "completed" | "active") => void;

  setSelectedIds: (ids: number[]) => void;
  toggleSelect: (id: number, checked: boolean) => void;
  setEditing: (todo: EditingTodo | null) => void;

  checkExpired: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      selectedIds: [],
      editing: null,
      search: "",

      setSearch: (val) => set({ search: val }),

      addTodo: (text, deadline = null, priority = "Medium") =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
              deadline,
              priority,
            },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      editTodo: (id, text, deadline, priority) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text, deadline, priority } : todo
          ),
        })),

      deleteMany: (ids) =>
        set((state) => ({
          todos: state.todos.filter((t) => !ids.includes(t.id)),
          selectedIds: [],
        })),

      completeMany: (ids) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            ids.includes(t.id) ? { ...t, completed: true } : t
          ),
          selectedIds: [],
        })),

      setFilter: (filter) => set({ filter }),

      setSelectedIds: (ids) => set({ selectedIds: ids }),
      toggleSelect: (id, checked) =>
        set((state) => ({
          selectedIds: checked
            ? [...state.selectedIds, id]
            : state.selectedIds.filter((i) => i !== id),
        })),

      setEditing: (todo) => set({ editing: todo }),

      checkExpired: () =>
        set((state) => {
          const now = Date.now();
          return {
            todos: state.todos.map((todo) => {
              if (
                todo.deadline &&
                new Date(todo.deadline).getTime() < now &&
                !todo.completed
              ) {
                return { ...todo, expired: true };
              }
              return todo;
            }),
          };
        }),
    }),
    { name: "todos" }
  )
);
