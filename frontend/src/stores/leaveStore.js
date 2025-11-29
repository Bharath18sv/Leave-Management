import { create } from "zustand";
import api from "../utils/api";

const useLeaveStore = create((set, get) => ({
  leaves: [],
  loading: false,
  error: null,

  // Apply for leave
  applyLeave: async (leaveData) => {
    console.log("Apply leave request:", leaveData);
    set({ loading: true, error: null });
    try {
      const response = await api.post("/leaves", leaveData);
      console.log("Apply leave response:", response.data);
      const newLeave = response.data.leaveRequest;

      set((state) => ({
        leaves: [newLeave, ...state.leaves],
        loading: false,
      }));

      return { success: true, leave: newLeave };
    } catch (error) {
      console.error("Apply leave error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to apply for leave";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch my leave requests
  fetchMyLeaves: async (status = "") => {
    console.log("Fetch my leaves with status:", status);
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/leaves/my-requests${status ? `?status=${status}` : ""}`
      );
      console.log("Fetch my leaves response:", response.data);
      set({
        leaves: response.data.leaveRequests,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      console.error("Fetch my leaves error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch leave requests";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Cancel leave request
  cancelLeave: async (leaveId) => {
    console.log("Cancel leave request ID:", leaveId);
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/leaves/${leaveId}`);
      console.log("Cancel leave response:", response.data);

      set((state) => ({
        leaves: state.leaves.filter((leave) => leave._id !== leaveId),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Cancel leave error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to cancel leave request";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch leave balance
  fetchLeaveBalance: async () => {
    console.log("Fetch leave balance request");
    set({ loading: true, error: null });
    try {
      const response = await api.get("/leaves/balance");
      console.log("Fetch leave balance response:", response.data);
      set({ loading: false });
      return { success: true, balance: response.data.leaveBalance };
    } catch (error) {
      console.error("Fetch leave balance error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch leave balance";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all leave requests (manager)
  fetchAllLeaves: async (params = {}) => {
    console.log("Fetch all leaves with params:", params);
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(
        `/leaves/all${queryParams ? `?${queryParams}` : ""}`
      );
      console.log("Fetch all leaves response:", response.data);
      set({
        leaves: response.data.leaveRequests,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Fetch all leaves error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch leave requests";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch pending leave requests (manager)
  fetchPendingLeaves: async () => {
    console.log("Fetch pending leaves request");
    set({ loading: true, error: null });
    try {
      const response = await api.get("/leaves/pending");
      console.log("Fetch pending leaves response:", response.data);
      set({
        leaves: response.data.pendingRequests,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Fetch pending leaves error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch pending requests";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Approve leave request (manager)
  approveLeave: async (leaveId, comment = "") => {
    console.log("Approve leave request ID:", leaveId, "with comment:", comment);
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/leaves/${leaveId}/approve`, {
        managerComment: comment,
      });
      console.log("Approve leave response:", response.data);
      const updatedLeave = response.data.leaveRequest;

      set((state) => ({
        leaves: state.leaves.map((leave) =>
          leave._id === leaveId ? updatedLeave : leave
        ),
        loading: false,
      }));

      return { success: true, leave: updatedLeave };
    } catch (error) {
      console.error("Approve leave error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to approve leave request";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Reject leave request (manager)
  rejectLeave: async (leaveId, comment) => {
    console.log("Reject leave request ID:", leaveId, "with comment:", comment);
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/leaves/${leaveId}/reject`, {
        managerComment: comment,
      });
      console.log("Reject leave response:", response.data);
      const updatedLeave = response.data.leaveRequest;

      set((state) => ({
        leaves: state.leaves.map((leave) =>
          leave._id === leaveId ? updatedLeave : leave
        ),
        loading: false,
      }));

      return { success: true, leave: updatedLeave };
    } catch (error) {
      console.error("Reject leave error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to reject leave request";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useLeaveStore;
