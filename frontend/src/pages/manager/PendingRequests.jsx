import React, { useState, useEffect } from "react";
import useLeaveStore from "../../stores/leaveStore";
import LeaveTable from "../../components/LeaveTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";

const PendingRequests = () => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [managerComment, setManagerComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const {
    leaves,
    loading,
    error,
    fetchPendingLeaves,
    approveLeave,
    rejectLeave,
    clearError,
  } = useLeaveStore();

  // Fetch pending leave requests on component mount
  useEffect(() => {
    fetchPendingLeaves();
  }, [fetchPendingLeaves]);

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
    setSelectedLeaveId(id);
    setManagerComment("");

    if (action === "approve") {
      setShowApproveModal(true);
    } else if (action === "reject") {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = async () => {
    if (selectedLeaveId) {
      const result = await approveLeave(selectedLeaveId, managerComment);

      if (result.success) {
        setToastMessage("Leave request approved successfully");
        setToastType("success");
        setShowToast(true);
        // Refresh the list
        fetchPendingLeaves();
      } else {
        setToastMessage(result.error || "Failed to approve leave request");
        setToastType("error");
        setShowToast(true);
      }

      setShowApproveModal(false);
      setSelectedLeaveId(null);
      setManagerComment("");
    }
  };

  const handleRejectConfirm = async () => {
    if (selectedLeaveId) {
      // Validate comment for rejection
      if (!managerComment.trim()) {
        setToastMessage("Comment is required for rejection");
        setToastType("error");
        setShowToast(true);
        return;
      }

      const result = await rejectLeave(selectedLeaveId, managerComment);

      if (result.success) {
        setToastMessage("Leave request rejected successfully");
        setToastType("success");
        setShowToast(true);
        // Refresh the list
        fetchPendingLeaves();
      } else {
        setToastMessage(result.error || "Failed to reject leave request");
        setToastType("error");
        setShowToast(true);
      }

      setShowRejectModal(false);
      setSelectedLeaveId(null);
      setManagerComment("");
    }
  };

  // Close toast handler
  const closeToast = () => {
    setShowToast(false);
  };

  // Close modals handler
  const closeModals = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedLeaveId(null);
    setManagerComment("");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Pending Leave Requests
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <LeaveTable
                  leaves={leaves}
                  userRole="manager"
                  onAction={handleAction}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={closeModals}
        title="Approve Leave Request"
        onSubmit={handleApproveConfirm}
        submitText="Approve"
      >
        <div className="space-y-4">
          <p>Are you sure you want to approve this leave request?</p>
          <div>
            <label
              htmlFor="approveComment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment (Optional)
            </label>
            <textarea
              id="approveComment"
              name="approveComment"
              rows={3}
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a comment for the employee (optional)"
            />
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={closeModals}
        title="Reject Leave Request"
        onSubmit={handleRejectConfirm}
        submitText="Reject"
      >
        <div className="space-y-4">
          <p>Are you sure you want to reject this leave request?</p>
          <div>
            <label
              htmlFor="rejectComment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectComment"
              name="rejectComment"
              rows={3}
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a comment explaining the rejection"
              required
            />
          </div>
        </div>
      </Modal>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
};

export default PendingRequests;
