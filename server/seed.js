const mongoose = require("mongoose");
const User = require("./models/User");
const LeaveRequest = require("./models/LeaveRequest");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/employee-leave-db"
  )
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await LeaveRequest.deleteMany({});

    console.log("Cleared existing data");

    // Create default manager
    const manager = new User({
      name: "System Manager",
      email: "manager@company.com",
      password: "Manager@123",
      role: "manager",
    });

    await manager.save();
    console.log("Created default manager");

    // Create sample employees
    const employees = [
      {
        name: "John Doe",
        email: "john.doe@company.com",
        password: "Employee@123",
        role: "employee",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        password: "Employee@123",
        role: "employee",
      },
      {
        name: "Robert Johnson",
        email: "robert.johnson@company.com",
        password: "Employee@123",
        role: "employee",
      },
    ];

    const createdEmployees = [];
    for (const empData of employees) {
      const emp = new User(empData);
      await emp.save();
      createdEmployees.push(emp);
      console.log(`Created employee: ${emp.name}`);
    }

    // Create sample leave requests
    const leaveRequests = [
      {
        userId: createdEmployees[0]._id,
        userName: createdEmployees[0].name,
        userEmail: createdEmployees[0].email,
        leaveType: "sick",
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        totalDays: 3,
        reason: "Medical appointment",
        status: "pending",
      },
      {
        userId: createdEmployees[1]._id,
        userName: createdEmployees[1].name,
        userEmail: createdEmployees[1].email,
        leaveType: "vacation",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        totalDays: 5,
        reason: "Family vacation",
        status: "approved",
      },
      {
        userId: createdEmployees[0]._id,
        userName: createdEmployees[0].name,
        userEmail: createdEmployees[0].email,
        leaveType: "casual",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        totalDays: 3,
        reason: "Personal work",
        status: "rejected",
      },
    ];

    for (const requestData of leaveRequests) {
      const leaveRequest = new LeaveRequest(requestData);
      await leaveRequest.save();
      console.log(`Created leave request for ${requestData.userName}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
