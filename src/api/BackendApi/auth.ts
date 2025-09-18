import api from "./api"

export async function login(username: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error && "response" in err) {
      const response = (err as { response?: { status?: number } }).response;
      if (response?.status === 401) {
        throw new Error("Invalid username or password");
      }
    }
    throw new Error("Server error");
  }
}

export async function register(username: string, password: string) {
  return api.post("/auth/register", {
    username,
    password,
  });
}

export const getUsername = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/auth/username", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

