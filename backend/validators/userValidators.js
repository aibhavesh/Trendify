import { buildValidationResult, isEmail, isEmpty } from "./helpers.js";

export const validateProfileUpdate = ({ name, email }) => {
  const errors = {};
  if (name !== undefined && isEmpty(name)) {
    errors.name = "Name cannot be empty";
  }
  if (email !== undefined) {
    if (isEmpty(email)) {
      errors.email = "Email cannot be empty";
    } else if (!isEmail(email)) {
      errors.email = "Email is invalid";
    }
  }
  return buildValidationResult(errors);
};
