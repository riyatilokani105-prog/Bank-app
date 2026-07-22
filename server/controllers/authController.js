const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const createAuditLog = require("../utils/createAuditLog");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register First Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const adminCount = await Admin.countDocuments();

    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Audit Log
    await createAuditLog(
      admin._id,
      "Admin Registered",
      `${admin.fullName} registered as administrator`,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(admin._id);

    // Audit Log
    await createAuditLog(
      admin._id,
      "Login",
      `${admin.fullName} logged in`,
      req.ip
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Logout
exports.logoutAdmin = async (req, res) => {
  try {

    await createAuditLog(
      req.user._id,
      "Logout",
      "Admin logged out",
      req.ip
    );

    res.json({
      success: true,
      message: "Logged out successfully.",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
// ======================
// Get Profile
// ======================
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      admin,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ======================
// Update Profile
// ======================
exports.updateProfile = async (req, res) => {
  try {

    const { fullName, email } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.fullName = fullName || admin.fullName;
    admin.email = email || admin.email;

    await admin.save();

    await createAuditLog(
      admin._id,
      "Profile Updated",
      `${admin.fullName} updated profile`,
      req.ip
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ======================
// Change Password
// ======================
exports.changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    await createAuditLog(
      admin._id,
      "Password Changed",
      "Administrator changed password",
      req.ip
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};