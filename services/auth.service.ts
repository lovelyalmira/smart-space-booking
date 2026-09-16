import api, { apiGet, apiPost } from "@/lib/api";
import { AuthUser, LoginResult, Member, Owner, Role } from "@/types";

export interface MemberRegisterPayload {
  username: string;
  password: string;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string;
}

export interface AdminRegisterPayload {
  username: string;
  password: string;
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
}

export interface RegisterResult {
  id: number;
  username: string;
  role: Role;
  access_token?: string;
  member?: Member;
  space_owner?: Owner;
}

export const authService = {
  registerMember: (payload: MemberRegisterPayload) =>
    apiPost<RegisterResult>("/api/auth/register/member", payload),

  registerAdmin: (payload: AdminRegisterPayload) =>
    apiPost<RegisterResult>("/api/auth/register/admin-space", payload),

  login: (username: string, password: string) =>
    apiPost<LoginResult>("/api/auth/login", { username, password }),

  profile: () => apiGet<AuthUser>("/api/auth/profile"),
};

export { api };
