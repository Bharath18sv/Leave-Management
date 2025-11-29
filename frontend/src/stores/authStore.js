import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login user
      login: async (email, password) => {
        console.log("Login request with email:", email);
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          console.log("Login response:", response.data);
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Register user
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          console.log("registering user with detials: ", name, email, password);
          const response = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          console.log("Response from registeration: ", response);
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("Registration error:", error);
          const errorMessage =
            error.response?.data?.message || "Registration failed";
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      // Check authentication status
      checkAuth: async () => {
        const { token } = get();
        console.log("Checking auth status with token:", token);
        if (!token) return;

        set({ loading: true });
        try {
          const response = await api.get("/auth/me");
          console.log("Auth check response:", response.data);
          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
