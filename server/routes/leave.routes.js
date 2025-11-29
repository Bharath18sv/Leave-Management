const express = require("express");
const {
  applyLeave,
  getMyLeaveRequests,
  cancelLeaveRequest,
  getLeaveBalance,
  getAllLeaveRequests,
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} = require("../controllers/leave.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// Employee routes
router.post("/", authMiddleware, roleMiddleware("employee"), applyLeave);
router.get(
  "/my-requests",
  authMiddleware,
  roleMiddleware("employee"),
  getMyLeaveRequests
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("employee"),
  cancelLeaveRequest
);
router.get(
  "/balance",
  authMiddleware,
  roleMiddleware("employee"),
  getLeaveBalance
);

// Manager routes
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("manager"),
  getAllLeaveRequests
);
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("manager"),
  getPendingLeaveRequests
);
router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("manager"),
  approveLeaveRequest
);
router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("manager"),
  rejectLeaveRequest
);

module.exports = router;
