import axiosClient from "@/api/axiosClient";
import { AxiosError } from "axios";
import i18n from "@/i18n";

export async function login(username: string, password: string) {
  try {
    const response = await axiosClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      throw new Error(i18n.t("notify.error_invalid"));
    }
    throw new Error("Server error");
  }
}

export async function register(username: string, password: string, email: string, fullName: string) {
  return axiosClient.post("/auth/register", {
    username,
    password,
    email,
    fullName,
  });
}

export const getUsername = async () => {
  const token = localStorage.getItem("token");
  const res = await axiosClient.get("/auth/username", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
