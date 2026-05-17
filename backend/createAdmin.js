import mongoose from "mongoose";
import dotenv from "dotenv";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await ensureDefaultAdmin({
    forcePasswordReset: process.env.RESET_DEFAULT_ADMIN_PASSWORD === "true",
    verbose: true,
  });

  console.log("Default admin seed complete.");
  mongoose.connection.close();
};

createAdmin();
