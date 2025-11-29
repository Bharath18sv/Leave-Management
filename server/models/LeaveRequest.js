const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["sick", "casual", "vacation"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    managerComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
leaveRequestSchema.index({ userId: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
