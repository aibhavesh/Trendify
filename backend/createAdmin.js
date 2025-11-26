import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UserModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // create admin
    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save(); // this will hash password

    console.log("Admin created successfully:", admin);

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
