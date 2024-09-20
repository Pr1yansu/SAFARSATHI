const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    value: {
      type: String,
      trim: true,
      required: [true, "Value is required"],
      lowercase: true,
      minlength: [2, "Value is too short"],
      maxlength: [32, "Value is too long"],
    },
    label: {
      type: String,
      trim: true,
      required: [true, "Label is required"],
      minlength: [2, "Label is too short"],
      maxlength: [32, "Label is too long"],
    },
    icon: {
      type: String,
      trim: true,
      required: [true, "Icon is required"],
      minlength: [2, "Icon is too short"],
      maxlength: [32, "Icon is too long"],
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
