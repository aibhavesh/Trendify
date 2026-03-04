import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/UserModel.js";   // verify correct path

mongoose.connect("mongodb+srv://bhaveshprajapat9981_db_user:2FmoAP1jxRKxcARY@cluster0.jefw48j.mongodb.net/?appName=Cluster0.abcd123.mongodb.net/trendify"); // or your DB URI

const createAdmin = async () => {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: passwordHash,
    role: "admin",
    isAdmin: true
  });

  console.log("Admin Created Successfully!");
  mongoose.connection.close();
};

createAdmin();
