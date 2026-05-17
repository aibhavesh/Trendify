import mongoose from "mongoose";
import dotenv from "dotenv";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";

dotenv.config();

const checkAndCreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const result = await ensureDefaultAdmin({
      forcePasswordReset: process.env.RESET_DEFAULT_ADMIN_PASSWORD === "true",
      verbose: true,
    });

    console.log("Admin seed result:", result);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
};

checkAndCreateAdmin();
