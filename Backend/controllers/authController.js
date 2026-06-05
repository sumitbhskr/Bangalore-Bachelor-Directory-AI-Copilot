const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userObj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
  res.status(statusCode).json({ success: true, token, user: userObj });
};

// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role === "owner" ? "owner" : "user", // users can only pick user or owner
  });
  sendTokenResponse(user, 201, res);
});

// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  if (!user.isActive) {
    return res
      .status(401)
      .json({ success: false, message: "Account has been deactivated." });
  }
  sendTokenResponse(user, 200, res);
});

// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "savedListings",
    "title type address rating",
  );
  res.json({ success: true, user });
});

// @route   PUT /api/auth/updateprofile
exports.updateProfile = asyncHandler(async (req, res) => {
  const fields = { name: req.body.name, phone: req.body.phone };
  if (req.body.avatar) fields.avatar = req.body.avatar;
  const user = await User.findByIdAndUpdate(req.user._id, fields, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, user });
});

// @route   PUT /api/auth/updatepassword
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(currentPassword))) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});
