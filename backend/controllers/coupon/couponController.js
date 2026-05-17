import Coupon from "../../models/CouponModel.js";

const calculateDiscount = (subtotal, coupon) => {
  const baseDiscount = (subtotal * coupon.discountPercent) / 100;
  if (coupon.maxDiscountAmount > 0) {
    return Math.min(baseDiscount, coupon.maxDiscountAmount);
  }
  return baseDiscount;
};

export const applyCoupon = async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return res.status(400).json({ success: false, message: "Valid subtotal is required" });
    }

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found or inactive" });
    }

    if (coupon.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
      });
    }

    const discountAmount = Number(calculateDiscount(subtotal, coupon).toFixed(2));

    return res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      discountAmount,
      finalSubtotal: Number((subtotal - discountAmount).toFixed(2)),
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, minOrderAmount = 0, maxDiscountAmount = 0, expiresAt, isActive = true } = req.body;

    if (!code || !expiresAt) {
      return res.status(400).json({ success: false, message: "code and expiresAt are required" });
    }

    const coupon = await Coupon.create({
      code,
      discountPercent,
      minOrderAmount,
      maxDiscountAmount,
      expiresAt,
      isActive,
    });

    return res.status(201).json({ success: true, message: "Coupon created", data: coupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    return res.status(200).json({ success: true, message: "Coupon updated", data: coupon });
  } catch (error) {
    console.error("Update coupon error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    return res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
