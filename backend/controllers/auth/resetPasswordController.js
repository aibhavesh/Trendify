import crypto from "crypto";
import User from "../../models/UserModel.js";
import { validateResetPasswordInput } from "../../validators/authValidators.js";

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const { isValid, errors } = validateResetPasswordInput({ password, confirmPassword });
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default resetPasswordController;
