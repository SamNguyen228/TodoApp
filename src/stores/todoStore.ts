import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: "all" | "completed" | "active";
  selectedIds: number[];
  editing: { id: number; text: string } | null;

  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  deleteMany: (ids: number[]) => void;
  completeMany: (ids: number[]) => void;
  setFilter: (filter: "all" | "completed" | "active") => void;

  setSelectedIds: (ids: number[]) => void;
  toggleSelect: (id: number, checked: boolean) => void;
  setEditing: (todo: { id: number; text: string } | null) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      selectedIds: [],
      editing: null,

      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now(), text, completed: false }],
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

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
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
    }),
    {
      name: "todos",
    }
  )
);
