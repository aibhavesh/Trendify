import Contact from "../../models/ContactModel.js";
import { validateContactPayload } from "../../validators/contactValidators.js";

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const { isValid, errors } = validateContactPayload({ name, email, message });

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const contactMessage = await Contact.create({ name, email, message });
    return res.status(201).json({
      success: true,
      message: "Message received. We'll be in touch soon!",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Create contact message error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllContactMessages = async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Get contact messages error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
