import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLeaveStore from "../../stores/leaveStore";
import useAuthStore from "../../stores/authStore";
import DateRangePicker from "../../components/DateRangePicker";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import {
  calculateBusinessDays,
  isWeekend,
  isPastDate,
} from "../../utils/dateUtils";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const navigate = useNavigate();
  const { applyLeave, loading, error, clearError } = useLeaveStore();
  const { user } = useAuthStore();

  // Calculate total business days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateBusinessDays(startDate, endDate);
      setTotalDays(days);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setShowToast(true);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!startDate || !endDate || !reason) {
      setToastMessage("Please fill in all required fields");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (isPastDate(startDate)) {
      setToastMessage("Cannot apply for leave in the past");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (isWeekend(startDate) || isWeekend(endDate)) {
      setToastMessage("Cannot apply for leave on weekends");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setToastMessage("Start date must be before end date");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (totalDays < 1) {
      setToastMessage("Leave request must be for at least 1 business day");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (totalDays > 30) {
      setToastMessage("Leave request cannot exceed 30 business days");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check leave balance
    // Ensure backward compatibility for users with missing leave balance data
    const leaveBalanceObj = user?.leaveBalance || {};
    // Use consistent naming convention: [type]Leave for all leave types
    const leaveBalance =
      leaveBalanceObj[`${leaveType}Leave`] ||
      (leaveType === "sick"
        ? 10
        : leaveType === "casual"
        ? 5
        : leaveType === "vacation"
        ? 5
        : 0);

    console.log("User object:", user);
    console.log("Leave type:", leaveType);
    console.log("Leave balance object:", leaveBalanceObj);
    console.log("Calculated leave balance:", leaveBalance);
    console.log("Total days requested:", totalDays);
    if (leaveBalance < totalDays) {
      setToastMessage(
        `Insufficient ${leaveType} leave balance. Available: ${leaveBalance} days`
      );
      setToastType("error");
      setShowToast(true);
      return;
    }

    const result = await applyLeave({
      leaveType,
      startDate,
      endDate,
      reason,
    });

    if (result.success) {
      setToastMessage("Leave request submitted successfully!");
      setToastType("success");
      setShowToast(true);

      // Reset form
      setLeaveType("sick");
      setStartDate("");
      setEndDate("");
      setReason("");
      setTotalDays(0);

      // Redirect to my requests page after a short delay
      setTimeout(() => {
        navigate("/employee/my-requests");
      }, 2000);
    }
  };

  // Close toast handler
  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Apply for Leave
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="leaveType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  style={{ fontSize: "16px", lineHeight: "1.5" }}
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="vacation">Vacation</option>
                </select>
              </div>

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />

              <div>
                <label
                  htmlFor="totalDays"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Business Days
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="totalDays"
                    name="totalDays"
                    value={totalDays}
                    readOnly
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Please provide a reason for your leave request"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/employee/my-requests")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Submitting...</span>
                    </div>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
};

export default ApplyLeave;
