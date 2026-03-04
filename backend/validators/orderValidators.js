import { buildValidationResult, isEmpty } from "./helpers.js";

const requiredShippingFields = [
  "fullName",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
];

export const validateShippingAddress = (shippingAddress = {}) => {
  const errors = {};

  requiredShippingFields.forEach((field) => {
    if (isEmpty(shippingAddress[field])) {
      errors[field] = `${field} is required`;
    }
  });

  return buildValidationResult(errors);
};

export const validatePaymentVerification = ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  orderId,
}) => {
  const errors = {};
  if (isEmpty(orderId)) errors.orderId = "Order id is required";
  if (isEmpty(razorpay_payment_id)) errors.razorpay_payment_id = "Payment id is required";
  if (isEmpty(razorpay_order_id)) errors.razorpay_order_id = "Order id from Razorpay is required";
  if (isEmpty(razorpay_signature)) errors.razorpay_signature = "Signature is required";

  return buildValidationResult(errors);
};
