import axios, { AxiosError } from "axios";
import { API_BASE_URL, APP_KEY } from "./config";
import { getAuthToken } from "./auth";
import { ApiError } from "@/types";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-maker-key"] = APP_KEY;
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown): string {
  const err = error as AxiosError<ApiError>;
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return "Permintaan melebihi batas waktu. Coba lagi.";
  if (err?.message === "Network Error")
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  if (err?.message) return err.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

// Generic helpers that unwrap the { data } envelope
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get(url, { params });
  return res.data.data as T;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post(url, body);
  return res.data.data as T;
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put(url, body);
  return res.data.data as T;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch(url, body);
  return res.data.data as T;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await api.delete(url);
  return res.data.data as T;
}

export default api;
