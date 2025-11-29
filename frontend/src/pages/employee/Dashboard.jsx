import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardStore from "../../stores/dashboardStore";
import useAuthStore from "../../stores/authStore";
import StatsCard from "../../components/StatsCard";
import LeaveTable from "../../components/LeaveTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, error, fetchEmployeeDashboard } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEmployeeDashboard();
  }, [fetchEmployeeDashboard]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading dashboard: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const leaveBalance = stats?.leaveBalance || {};
  const recentRequests = stats?.recentRequests || [];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Employee Dashboard
        </h1>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Leaves"
            value={stats?.totalLeaves || 0}
            icon={<CalendarIcon className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Pending Leaves"
            value={stats?.pendingLeaves || 0}
            icon={<ClockIcon className="h-6 w-6" />}
            color="yellow"
          />
          <StatsCard
            title="Approved Leaves"
            value={stats?.approvedLeaves || 0}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Rejected Leaves"
            value={stats?.rejectedLeaves || 0}
            icon={<XCircleIcon className="h-6 w-6" />}
            color="red"
          />
        </div>

        {/* Leave Balance */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Leave Balance
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatsCard
              title="Sick Leave"
              value={leaveBalance.sickLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="red"
            />
            <StatsCard
              title="Casual Leave"
              value={leaveBalance.casualLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="blue"
            />
            <StatsCard
              title="Vacation"
              value={leaveBalance.vacationLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </div>

        {/* Recent Requests */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Leave Requests
            </h2>
            <button
              onClick={() => navigate("/employee/apply-leave")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply for Leave
            </button>
          </div>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <LeaveTable
              leaves={recentRequests}
              userRole="employee"
              onAction={(action, id) => {
                if (action === "cancel") {
                  // Handle cancel action
                  console.log("Cancel leave request:", id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
