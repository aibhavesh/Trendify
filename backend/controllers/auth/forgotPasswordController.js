import crypto from "crypto";
import User from "../../models/UserModel.js";
import { validateForgotPasswordInput } from "../../validators/authValidators.js";
import sendPasswordResetEmail from "../../utils/sendPasswordResetEmail.js";

const forgotPasswordController = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { isValid, errors } = validateForgotPasswordInput({ email });

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const user = await User.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password/${rawToken}`;

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = resetPasswordExpires;
      await user.save();

      try {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          resetUrl,
        });
      } catch (emailError) {
        console.error("Password reset email error:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(200).json({
      success: true,
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  }
};

export default forgotPasswordController;
