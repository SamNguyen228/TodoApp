import { create } from "zustand";

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

const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: loadTodos(),
  filter: "all",
  selectedIds: [],
  editing: null,

  addTodo: (text) =>
    set((state) => {
      const newTodos = [...state.todos, { id: Date.now(), text, completed: false }];
      saveTodos(newTodos);
      return { todos: newTodos };
    }),

  toggleTodo: (id) =>
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(newTodos);
      return { todos: newTodos };
    }),

  deleteTodo: (id) =>
    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(newTodos);
      return { todos: newTodos };
    }),

  editTodo: (id, text) =>
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      );
      saveTodos(newTodos);
      return { todos: newTodos };
    }),

  deleteMany: (ids) =>
    set((state) => {
      const newTodos = state.todos.filter((t) => !ids.includes(t.id));
      saveTodos(newTodos);
      return { todos: newTodos, selectedIds: [] };
    }),

  completeMany: (ids) =>
    set((state) => {
      const newTodos = state.todos.map((t) =>
        ids.includes(t.id) ? { ...t, completed: true } : t
      );
      saveTodos(newTodos);
      return { todos: newTodos, selectedIds: [] };
    }),

  setFilter: (filter) => set({ filter }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelect: (id, checked) =>
    set((state) => ({
      selectedIds: checked
        ? [...state.selectedIds, id]
        : state.selectedIds.filter((i) => i !== id),
    })),

  setEditing: (todo) => set({ editing: todo }),
}));
