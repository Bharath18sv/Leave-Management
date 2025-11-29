import React, { useState, useEffect } from "react";
import useLeaveStore from "../../stores/leaveStore";
import LeaveTable from "../../components/LeaveTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";

const MyRequests = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const { leaves, loading, error, fetchMyLeaves, cancelLeave, clearError } =
    useLeaveStore();

  // Fetch leave requests on component mount and when filter changes
  useEffect(() => {
    fetchMyLeaves(statusFilter);
  }, [statusFilter, fetchMyLeaves]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setShowToast(true);
      clearError();
    }
  }, [error, clearError]);

  const handleAction = (action, id) => {
    if (action === "cancel") {
      setSelectedLeaveId(id);
      setShowCancelModal(true);
    }
  };

  const handleCancelConfirm = async () => {
    if (selectedLeaveId) {
      const result = await cancelLeave(selectedLeaveId);

      if (result.success) {
        setToastMessage("Leave request cancelled successfully");
        setToastType("success");
        setShowToast(true);
        // Refresh the list
        fetchMyLeaves(statusFilter);
      } else {
        setToastMessage(result.error || "Failed to cancel leave request");
        setToastType("error");
        setShowToast(true);
      }

      setShowCancelModal(false);
      setSelectedLeaveId(null);
    }
  };

  // Close toast handler
  const closeToast = () => {
    setShowToast(false);
  };

  // Close modal handler
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedLeaveId(null);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Leave Requests
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStatusFilter("")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      statusFilter === ""
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      statusFilter === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter("approved")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      statusFilter === "approved"
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setStatusFilter("rejected")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      statusFilter === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <LeaveTable
                  leaves={leaves}
                  userRole="employee"
                  onAction={handleAction}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        title="Cancel Leave Request"
        onSubmit={handleCancelConfirm}
        submitText="Yes, Cancel"
        cancelText="No, Keep"
      >
        <p>Are you sure you want to cancel this leave request?</p>
      </Modal>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
};

export default MyRequests;
