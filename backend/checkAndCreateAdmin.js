import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkAndCreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Connected to MongoDB");
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists:");
      console.log({
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role,
        hasPassword: !!existingAdmin.password
      });
      
      // Set plain password - the pre-save hook will hash it
      existingAdmin.password = "admin123";
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ Password reset to: admin123");
    } else {
      // Create new admin with plain password - pre-save hook will hash it
      const newAdmin = await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        isAdmin: true
      });
      console.log("✅ Admin created successfully!");
      console.log("Email: admin@example.com");
      console.log("Password: admin123");
    }
    
    // Verify the password works
    const testUser = await User.findOne({ email: "admin@example.com" });
    const isMatch = await bcrypt.compare("admin123", testUser.password);
    console.log("\n🔐 Password verification:", isMatch ? "✅ SUCCESS" : "❌ FAILED");
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
};

checkAndCreateAdmin();
