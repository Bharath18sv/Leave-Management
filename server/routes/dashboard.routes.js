const express = require("express");
const {
  getEmployeeDashboard,
  getManagerDashboard,
} = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("employee"),
  getEmployeeDashboard
);
router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("manager"),
  getManagerDashboard
);

module.exports = router;
