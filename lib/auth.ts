import { AuthUser, Role } from "@/types";
import { TOKEN_KEY, ROLE_KEY, USER_KEY } from "./config";

const isBrowser = () => typeof window !== "undefined";

function setCookie(name: string, value: string, days = 7) {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function saveSession(token: string, role: Role, user: AuthUser) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setCookie(TOKEN_KEY, token);
  setCookie(ROLE_KEY, role);
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): Role | null {
  if (!isBrowser()) return null;
  return (localStorage.getItem(ROLE_KEY) as Role) || null;
}

export function getUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function updateStoredUser(user: AuthUser) {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);
}

export function homePathForRole(role: Role | null): string {
  if (role === "admin_space") return "/admin/dashboard";
  if (role === "member") return "/member/dashboard";
  return "/login";
}
