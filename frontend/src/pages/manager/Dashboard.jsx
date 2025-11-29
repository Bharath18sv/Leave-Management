import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardStore from "../../stores/dashboardStore";
import useLeaveStore from "../../stores/leaveStore";
import StatsCard from "../../components/StatsCard";
import LeaveTable from "../../components/LeaveTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const {
    stats,
    loading: dashboardLoading,
    error: dashboardError,
    fetchManagerDashboard,
  } = useDashboardStore();
  const { approveLeave, rejectLeave, clearError } = useLeaveStore();

  useEffect(() => {
    fetchManagerDashboard();
  }, [fetchManagerDashboard]);

  // Close toast handler
  const closeToast = () => {
    setShowToast(false);
  };

  const handleApprove = async (leaveId) => {
    try {
      const result = await approveLeave(leaveId, "");

      if (result.success) {
        setToastMessage("Leave request approved successfully");
        setToastType("success");
        setShowToast(true);
        // Refresh dashboard data
        fetchManagerDashboard();
      } else {
        setToastMessage(result.error || "Failed to approve leave request");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("An error occurred while approving the leave request");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      // For simplicity, we're not asking for a comment here
      // In a real application, you might want to show a modal to get a comment
      const result = await rejectLeave(
        leaveId,
        "Rejected by manager from dashboard"
      );

      if (result.success) {
        setToastMessage("Leave request rejected successfully");
        setToastType("success");
        setShowToast(true);
        // Refresh dashboard data
        fetchManagerDashboard();
      } else {
        setToastMessage(result.error || "Failed to reject leave request");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("An error occurred while rejecting the leave request");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleAction = async (action, id) => {
    if (action === "approve") {
      await handleApprove(id);
    } else if (action === "reject") {
      await handleReject(id);
    }
  };

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading dashboard: {dashboardError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const recentRequests = stats?.recentRequests || [];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manager Dashboard
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={stats?.totalEmployees || 0}
            icon={<UsersIcon className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Pending Requests"
            value={stats?.totalPendingRequests || 0}
            icon={<ClockIcon className="h-6 w-6" />}
            color="yellow"
          />
          <StatsCard
            title="Approved Today"
            value={stats?.totalApprovedToday || 0}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Rejected Today"
            value={stats?.totalRejectedToday || 0}
            icon={<XCircleIcon className="h-6 w-6" />}
            color="red"
          />
        </div>

        {/* Recent Requests */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Leave Requests
            </h2>
            <button
              onClick={() => navigate("/manager/pending-requests")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All Pending
            </button>
          </div>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <LeaveTable
              leaves={recentRequests}
              userRole="manager"
              onAction={handleAction}
            />
          </div>
        </div>
      </div>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
};

export default ManagerDashboard;
