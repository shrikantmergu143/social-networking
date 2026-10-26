// src/services/auth.api.ts
import { http } from "@/lib/http";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const authApi = {
  async register(payload: RegisterRequest) {
      const result = await http.post<AuthResponse, RegisterRequest>(
        "/auth/register",
        payload,
      );

      // tokenStorage.set(result.accessToken);
      return result;
  },

  async login(payload: LoginRequest, message?: any) {
    const result = await http.post<AuthResponse, LoginRequest>(
      "/auth/login",
      payload,
      {},
      message
    );

    // tokenStorage.set(result.accessToken);
    return result;
  },

  me() {
    return http.get<any>("/auth/me");
  },

  logout() {
    return http.delete<{ loggedOut: boolean }>('/auth/session');
  },
};
