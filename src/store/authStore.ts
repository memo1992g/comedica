import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  User,
  LoginCredentials,
  PasswordChangeRequest,
  UserRole,
  UserStatus,
} from "@/types";
import { authService } from "@/lib/api/auth.service";
import { storage } from "@/lib/utils";
import { clearAuthCookie, setAuthCookie } from "@/lib/utils/auth-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (request: PasswordChangeRequest) => Promise<void>;
  firstPasswordChange: (request: PasswordChangeRequest) => Promise<void>;
  validateSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          try {
            const mockUser: User = {
              id: "1",
              username: "admin",              
              email: "admin@comedica.com",
              fullName: "Administrador Principal",
              role: "admin" as UserRole,
              associateNumber: "00001",
              dui: "00000000-0",
              phone: "7777-7777",
              createdAt: "2026-01-01T00:00:00Z",
              lastPasswordChange: "2026-01-01T00:00:00Z",
              requiresPasswordChange: false,
              status: "active" as UserStatus,
            };
            const mockToken = "token-1";

            // Guardar token y usuario de ejemplo
            storage.set("auth_token", mockToken);
            storage.set("user", mockUser);
            setAuthCookie(mockToken);

            set({
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
            });

            // Si requiere cambio de contraseña, redirigir
            if (mockUser.requiresPasswordChange) {
              globalThis.location.href = "/auth/first-password-change";
            } else {
              globalThis.location.href = "/dashboard";
            }
          } catch (error: any) {
            set({
              error: error.message || "Error al iniciar sesión",
              isLoading: false,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
          } finally {
            // Limpiar estado
            storage.remove("auth_token");
            storage.remove("user");
            clearAuthCookie();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            globalThis.location.href = "/auth/login";
          }
        },

        changePassword: async (request: PasswordChangeRequest) => {
          set({ isLoading: true, error: null });
          try {
            await authService.changePassword(request);
            set({ isLoading: false });
          } catch (error: any) {
            set({
              error: error.message || "Error al cambiar contraseña",
              isLoading: false,
            });
            throw error;
          }
        },

        firstPasswordChange: async (request: PasswordChangeRequest) => {
          set({ isLoading: true, error: null });
          try {
            await authService.firstPasswordChange(request);
            set({ isLoading: false });

            // Actualizar estado del usuario
            const user = get().user;
            if (user) {
              const updatedUser = { ...user, requiresPasswordChange: false };
              set({ user: updatedUser });
              storage.set("user", updatedUser);
            }

            globalThis.location.href = "/dashboard";
          } catch (error: any) {
            set({
              error: error.message || "Error al cambiar contraseña",
              isLoading: false,
            });
            throw error;
          }
        },

        validateSession: async () => {
          const token = storage.get<string>("auth_token");
          const storedUser = storage.get<User>("user");

          if (!token || !storedUser) {
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false,
            });
            return;
          }

          // Si hay token y usuario en storage, considerarlo autenticado
          set({
            user: storedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);
