const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    provider: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      trim: true,
    },
    githubId: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.provider && !this.googleId && !this.githubId;
      },
      trim: true,
      minLength: [6, "Password must be at least 6 characters"],
      maxLength: [50, "Password must be at most 50 characters"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

userSchema.methods.comparePasswords = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByGoogleId = async function (googleId) {
  return this.findOne({ googleId });
};

userSchema.statics.findByGithubId = async function (githubId) {
  return this.findOne({ githubId });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
