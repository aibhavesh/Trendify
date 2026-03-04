import Razorpay from "razorpay";

let razorpayInstance = null;

export const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "placeholder" || keyId === "rzp_test_placeholder") {
      console.warn("⚠️  Razorpay credentials not configured. Payment features will not work.");
      return null;
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
};

export default getRazorpay;
