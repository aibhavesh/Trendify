import User from "../models/UserModel.js";

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@clothingstore.com";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@12345";
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || "Store Admin";

export const ensureDefaultAdmin = async ({ forcePasswordReset = false, verbose = false } = {}) => {
  const normalizedEmail = String(DEFAULT_ADMIN_EMAIL).toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  if (!existing) {
    const created = await User.create({
      name: DEFAULT_ADMIN_NAME,
      email: normalizedEmail,
      password: DEFAULT_ADMIN_PASSWORD,
      role: "admin",
    });

    if (verbose) {
      console.log(`✅ Default admin created: ${created.email}`);
    }

    return { created: true, updated: false, email: created.email };
  }

  let updated = false;
  if (existing.role !== "admin") {
    existing.role = "admin";
    updated = true;
  }

  if (forcePasswordReset) {
    existing.password = DEFAULT_ADMIN_PASSWORD;
    updated = true;
  }

  if (updated) {
    await existing.save();
  }

  if (verbose) {
    console.log(`${updated ? "✅ Default admin updated" : "ℹ️ Default admin already present"}: ${existing.email}`);
  }

  return { created: false, updated, email: existing.email };
};

export default ensureDefaultAdmin;