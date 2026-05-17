import { buildValidationResult, isEmail, isEmpty } from "./helpers.js";

export const validateContactPayload = ({ name, email, message }) => {
  const errors = {};

  if (isEmpty(name)) errors.name = "Name is required";

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(message)) {
    errors.message = "Message is required";
  } else if (String(message).length < 10) {
    errors.message = "Message should be at least 10 characters";
  }

  return buildValidationResult(errors);
};
