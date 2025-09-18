import { create } from "zustand";
import { todoApi } from "@/api/BackendApi/todo";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  autoCompleted: boolean;
  createdAt: string;
  updateAt: string;
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
  todos: Todo[];
  filter: "all" | "completed" | "active";
  selectedIds: number[];
  editing: EditingTodo | null;
  search: string;

  loadTodos: () => Promise<void>;
  setSearch: (val: string) => void;
  addTodo: (title: string, deadline: string | null, priority: Priority) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (id: number, title: string, deadline: string | null, priority: Priority) => Promise<void>;
  deleteMany: (ids: number[]) => Promise<void>;
  completeMany: (ids: number[]) => Promise<void>;
  setFilter: (filter: "all" | "completed" | "active") => void;
  setSelectedIds: (ids: number[]) => void;
  toggleSelect: (id: number, checked: boolean) => void;
  setEditing: (todo: EditingTodo | null) => void;
  checkExpired: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  filter: "all",
  selectedIds: [],
  editing: null,
  search: "",

  // loadTodos: async () => {
  //   const todos = await todoApi.getTodos();
  //   set({ todos });
  // },

  loadTodos: async () => {
    const todosFromApi: Todo[] = await todoApi.getTodos();

    const todosWithExpired: Todo[] = todosFromApi.map((todo) => ({
      ...todo,
      expired: todo.autoCompleted ?? false,
    }));

    set({ todos: todosWithExpired });
  },

  setSearch: (val) => set({ search: val }),

  addTodo: async (title, deadline = null, priority = "Medium") => {
    const newTodo = await todoApi.createTodo(title, deadline, priority);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = await todoApi.updateTodo(id, { completed: !todo.completed });
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTodo: async (id) => {
    await todoApi.deleteTodo(id);
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
  },

  editTodo: async (id, title, deadline, priority) => {
    const updated = await todoApi.updateTodo(id, { title, deadline, priority });
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteMany: async (ids) => {
    await Promise.all(ids.map((id) => todoApi.deleteTodo(id)));
    set((state) => ({
      todos: state.todos.filter((t) => !ids.includes(t.id)),
      selectedIds: [],
    }));
  },

  completeMany: async (ids) => {
    await Promise.all(ids.map((id) => todoApi.updateTodo(id, { completed: true })));
    set((state) => ({
      todos: state.todos.map((t) =>
        ids.includes(t.id) ? { ...t, completed: true } : t
      ),
      selectedIds: [],
    }));
  },

  setFilter: (filter) => set({ filter }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  toggleSelect: (id, checked) =>
    set((state) => ({
      selectedIds: checked
        ? [...state.selectedIds, id]
        : state.selectedIds.filter((i) => i !== id),
    })),

  setEditing: (todo) => set({ editing: todo }),

  // checkExpired: () =>
  //   set((state) => {
  //     const now = Date.now();
  //     return {
  //       todos: state.todos.map((todo) => {
  //         if (
  //           todo.deadline &&
  //           new Date(todo.deadline).getTime() < now &&
  //           !todo.completed
  //         ) {
  //           return { ...todo, expired: true };
  //         }
  //         return { ...todo, expired: false };
  //       }),
  //     };
  //   }),

  //   checkExpired: async () => {
  //   const now = Date.now();
  //   const todos = get().todos;

  //   const updatedTodos = await Promise.all(
  //     todos.map(async (todo) => {
  //       if (todo.deadline && new Date(todo.deadline).getTime() < now && !todo.completed) {
  //         // quá hạn → set completed + autoCompleted = true
  //         const updated = await todoApi.updateTodo(todo.id, {
  //           completed: true,
  //           autoCompleted: true,
  //         });
  //         return { ...updated, expired: true };
  //       }
  //       return { ...todo, expired: false };
  //     })
  //   );

  //   set({ todos: updatedTodos });
  // },

  checkExpired: async () => {
    const updatedTodos: Todo[] = await todoApi.autoCompleteOverdue();
    const now = Date.now();

    set((state) => {
      const updatedMap: Record<number, Todo> = Object.fromEntries(
        updatedTodos.map((t) => [t.id, t])
      );

      const merged: Todo[] = state.todos.map((todo) => {
        const updated = updatedMap[todo.id];
        const completed = updated?.completed ?? todo.completed;
        const autoCompleted = updated?.autoCompleted ?? todo.autoCompleted;

        return {
          ...todo,
          completed,
          autoCompleted,
          expired: todo.deadline
            ? new Date(todo.deadline).getTime() < now && !completed
            : false,
        };
      });

      return { todos: merged };
    });
  },
}));
