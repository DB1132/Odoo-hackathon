const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
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

salarySchema.pre("save", function (next) {
  this.netSalary = this.basicPay + this.allowances - this.deductions;
  next();
});

module.exports = mongoose.model("Salary", salarySchema);
