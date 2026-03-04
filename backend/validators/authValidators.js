import { buildValidationResult, isEmail, isEmpty } from "./helpers.js";

export const validateRegisterInput = ({ name, email, password }) => {
  const errors = {};

  if (isEmpty(name)) errors.name = "Name is required";
  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Email is invalid";
  }
  if (isEmpty(password)) {
    errors.password = "Password is required";
  } else if (String(password).length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return buildValidationResult(errors);
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  }

  return buildValidationResult(errors);
};
