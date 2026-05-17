import Razorpay from "razorpay";

let razorpayInstance = null;
let razorpayInitialized = false;

export const initializeRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "placeholder" || keyId === "rzp_test_placeholder") {
    console.warn("⚠️  Razorpay credentials not configured. Payment features will not work.");
    return false;
  }

  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("✅ Razorpay configured and ready for payments.");
    razorpayInitialized = true;
    return true;
  } catch (error) {
    console.error("❌ Razorpay initialization failed:", error.message);
    return false;
  }
};

export const getRazorpay = () => {
  if (!razorpayInstance) {
    initializeRazorpay();
  }
  return razorpayInstance;
};

export default getRazorpay;
