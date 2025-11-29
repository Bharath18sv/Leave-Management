import { create } from "zustand";
import api from "../utils/api";

const useDashboardStore = create((set, get) => ({
  stats: null,
  loading: false,
  error: null,

  // Fetch employee dashboard data
  fetchEmployeeDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/dashboard/employee");
      set({
        stats: response.data,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch dashboard data";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch manager dashboard data
  fetchManagerDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/dashboard/manager");
      set({
        stats: response.data,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch dashboard data";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useDashboardStore;
