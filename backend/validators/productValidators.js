import { buildValidationResult, isEmpty } from "./helpers.js";
import { PRODUCT_CATEGORIES, isValidCategory } from "../constants/categories.js";

export const validateProductPayload = ({ title, description, price, category }) => {
  const errors = {};

  if (isEmpty(title)) errors.title = "Title is required";
  if (isEmpty(description)) errors.description = "Description is required";
  if (price === undefined || price === null || Number(price) < 0) {
    errors.price = "Price must be a positive number";
  }
  if (isEmpty(category)) {
    errors.category = "Category is required";
  } else if (!isValidCategory(category)) {
    errors.category = `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`;
  }

  return buildValidationResult(errors);
};
