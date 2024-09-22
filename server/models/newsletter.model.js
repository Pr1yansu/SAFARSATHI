const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      lowercase: true,
      minlength: [6, "Email is too short"],
      maxlength: [64, "Email is too long"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
