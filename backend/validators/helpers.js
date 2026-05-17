export const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim().toLowerCase());

export const buildValidationResult = (errors) => ({
  isValid: Object.keys(errors).length === 0,
  errors,
});
