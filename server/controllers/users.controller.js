const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mail.utils");
const { uploadImage } = require("../utils/image.utils");
const logger = require("../utils/logger.utils");
const fs = require("fs");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");

const readFileAsync = promisify(fs.readFile);

const forgotPasswordTemplate = async (reset_link) => {
  try {
    const path = `${__dirname}/../templates/forgot-password.html`;
    const html = await readFileAsync(path, "utf-8");
    return html.replace("{{ reset_link }}", reset_link);
  } catch (error) {
    logger.error("Error reading forgot password template:", error);
    throw new Error("Failed to load email template");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "asc",
      role = "",
    } = req.query;

    const query = {};

    if (search !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "") {
      query.role = role;
    }

    const users = await User.find(query)
      .sort({ [sortBy]: order })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    return res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error("Error getting all users:", error);

    if (error.name === "MongoError") {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to get all users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error getting user by ID:", error);

    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "Failed to get user by ID" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error getting current user:", error);

    return res.status(500).json({ message: "Failed to get current user" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { file } = req;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const avatar = file ? await uploadImage(file.path) : "";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(201).json({
      user: user.toJSON(),
      message: "User registered successfully",
    });
  } catch (error) {
    logger.error("Error registering user:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to register user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { file } = req;

    if (!name || !email || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, and role are required" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (file) {
      user.avatar = await uploadImage(file.path);
    }

    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    logger.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user:", error);

    return res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Cannot update own role" });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    logger.error("Error updating user role:", error);

    return res.status(500).json({ message: "Failed to update user role" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    logger.error("Error changing password:", error);

    return res.status(500).json({ message: "Failed to change password" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const duration = 15 * 60 * 1000;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const subject = "Reset Password";
    const text = `Click on the link to reset your password: ${resetUrl}`;
    const html = await forgotPasswordTemplate(resetUrl);

    await sendMail(email, subject, text, html);

    return res.status(200).json({ message: "Email sent", duration: duration });
  } catch (error) {
    logger.error("Error sending forgot password email:", error);

    return res.status(500).json({ message: "Failed to send email" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    logger.error("Error resetting password:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token expired" });
    }

    return res.status(500).json({ message: "Failed to reset password" });
  }
};
