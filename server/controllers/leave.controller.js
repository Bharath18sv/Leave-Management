const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");
const {
  calculateBusinessDays,
  isWeekend,
  isPastDate,
} = require("../utils/dateUtils");

// Apply for leave (Employee only)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    console.log("request body: ", req.body);
    const userId = req.user._id;
    const user = req.user;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before or equal to end date",
      });
    }

    // Check if dates are in the past
    if (isPastDate(start)) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply for leave in the past",
      });
    }

    // Check if dates are weekends
    if (isWeekend(start) || isWeekend(end)) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply for leave on weekends",
      });
    }

    // Calculate business days
    const totalDays = calculateBusinessDays(start, end);

    if (totalDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Leave request must be for at least 1 business day",
      });
    }

    if (totalDays > 30) {
      return res.status(400).json({
        success: false,
        message: "Leave request cannot exceed 30 business days",
      });
    }

    // Check leave balance
    const leaveBalance = user.leaveBalance[`${leaveType}Leave`] || 0;
    if (leaveBalance < totalDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. Available: ${leaveBalance} days`,
      });
    }

    // Check for overlapping leaves
    const overlappingLeave = await LeaveRequest.findOne({
      userId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      status: { $in: ["pending", "approved"] },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        success: false,
        message: "Overlapping leave request detected",
      });
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
      userId,
      userName: user.name,
      userEmail: user.email,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
    });

    await leaveRequest.save();

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying for leave",
      error: error.message,
    });
  }
};

// Get my leave requests (Employee only)
const getMyLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user._id;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const leaveRequests = await LeaveRequest.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      leaveRequests,
      total: leaveRequests.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave requests",
      error: error.message,
    });
  }
};

// Cancel leave request (Employee only)
const cancelLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const leaveRequest = await LeaveRequest.findOne({ _id: id, userId });

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be cancelled",
      });
    }

    await LeaveRequest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling leave request",
      error: error.message,
    });
  }
};

// Get leave balance (Employee only)
const getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      leaveBalance: user.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave balance",
      error: error.message,
    });
  }
};

// Get all leave requests (Manager only)
const getAllLeaveRequests = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }

    const skip = (page - 1) * limit;

    const leaveRequests = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LeaveRequest.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      leaveRequests,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave requests",
      error: error.message,
    });
  }
};

// Get pending leave requests (Manager only)
const getPendingLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      pendingRequests: leaveRequests,
      total: leaveRequests.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending leave requests",
      error: error.message,
    });
  }
};

// Approve leave request (Manager only)
const approveLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerComment } = req.body;

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be approved",
      });
    }

    // Update leave request
    leaveRequest.status = "approved";
    leaveRequest.managerComment = managerComment || "";
    await leaveRequest.save();

    // Deduct leave balance from user
    const user = await User.findById(leaveRequest.userId);
    if (user) {
      const leaveTypeProperty = `${leaveRequest.leaveType}Leave`;
      const currentBalance = user.leaveBalance[leaveTypeProperty] || 0;

      // Check if user has sufficient leave balance
      if (currentBalance < leaveRequest.totalDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient ${leaveRequest.leaveType} leave balance. Available: ${currentBalance} days, Requested: ${leaveRequest.totalDays} days`,
        });
      }

      // Deduct leave days
      user.leaveBalance[leaveTypeProperty] -= leaveRequest.totalDays;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving leave request",
      error: error.message,
    });
  }
};

// Reject leave request (Manager only)
const rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerComment } = req.body;

    if (!managerComment) {
      return res.status(400).json({
        success: false,
        message: "Manager comment is required for rejection",
      });
    }

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be rejected",
      });
    }

    // Update leave request
    leaveRequest.status = "rejected";
    leaveRequest.managerComment = managerComment;
    await leaveRequest.save();

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting leave request",
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaveRequests,
  cancelLeaveRequest,
  getLeaveBalance,
  getAllLeaveRequests,
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
};
