const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const leaveBalanceSchema = new mongoose.Schema({
  sickLeave: {
    type: Number,
    default: 10,
  },
  casualLeave: {
    type: Number,
    default: 5,
  },
  vacationLeave: {
    type: Number,
    default: 5,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    leaveBalance: {
      type: leaveBalanceSchema,
      default: () => ({
        sickLeave: 10,
        casualLeave: 5,
        vacationLeave: 5,
      }),
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from toJSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
