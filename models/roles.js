const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({

  role_name: { type: String, required: true },
  department: { type: String, required: true },
  responsibilities: { type: String },
  qualifications: { type: String },
  salary: { type: Number }
});



module.exports = mongoose.model('Role', RoleSchema);
// {
//   "role_name": "Example Role",
//   "department": "Example Department",
//   "responsibilities": "Example Responsibilities",
//   "qualifications": "Example Qualifications",
//   "salary": 2000
// }