const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  basicPay: {
    type: Number,
    required: true
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number
  }
}, { timestamps: true });

// Auto-calculate net salary
salarySchema.pre("save", function (next) {
  this.netSalary = this.basicPay + this.allowances - this.deductions;
  next();
});

module.exports = mongoose.model("Salary", salarySchema);
