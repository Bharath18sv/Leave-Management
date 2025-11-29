const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

// Get employee dashboard data
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's leave balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get leave statistics
    const totalLeaves = await LeaveRequest.countDocuments({ userId });
    const pendingLeaves = await LeaveRequest.countDocuments({
      userId,
      status: "pending",
    });
    const approvedLeaves = await LeaveRequest.countDocuments({
      userId,
      status: "approved",
    });
    const rejectedLeaves = await LeaveRequest.countDocuments({
      userId,
      status: "rejected",
    });

    // Get recent requests (last 5)
    const recentRequests = await LeaveRequest.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      leaveBalance: user.leaveBalance,
      recentRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

// Get manager dashboard data
const getManagerDashboard = async (req, res) => {
  try {
    // Get total employees (excluding managers)
    const totalEmployees = await User.countDocuments({ role: "employee" });

    // Get leave statistics
    const totalPendingRequests = await LeaveRequest.countDocuments({
      status: "pending",
    });

    // Get today's approved/rejected counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalApprovedToday = await LeaveRequest.countDocuments({
      status: "approved",
      updatedAt: { $gte: today },
    });

    const totalRejectedToday = await LeaveRequest.countDocuments({
      status: "rejected",
      updatedAt: { $gte: today },
    });

    // Get recent requests (last 10)
    const recentRequests = await LeaveRequest.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      totalEmployees,
      totalPendingRequests,
      totalApprovedToday,
      totalRejectedToday,
      recentRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployeeDashboard,
  getManagerDashboard,
};
