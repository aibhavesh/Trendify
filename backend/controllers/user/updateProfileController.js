import User from "../../models/UserModel.js";
import { validateProfileUpdate } from "../../validators/userValidators.js";

export const updateProfileController = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { isValid, errors } = validateProfileUpdate({ name, email });

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    if (updates.email && updates.email !== req.user.email) {
      const emailTaken = await User.findOne({ email: updates.email });
      if (emailTaken) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
