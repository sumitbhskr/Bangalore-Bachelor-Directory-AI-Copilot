// JWT protect + role authorize + ownerOrAdmin

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User not found or deactivated." });
    }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action.`,
      });
    }
    next();
  };
};

// Check if user owns the resource or is admin
exports.ownerOrAdmin = (Model) => async (req, res, next) => {
  const resource = await Model.findById(req.params.id);
  if (!resource) {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found." });
  }
  const isOwner = resource.owner
    ? resource.owner.toString() === req.user._id.toString()
    : resource.user && resource.user.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        success: false,
        message: "Not authorized to modify this resource.",
      });
  }
  req.resource = resource;
  next();
};
