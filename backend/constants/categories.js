/**
 * Product Categories Constants
 * Centralized definition of all allowed product categories
 */

export const PRODUCT_CATEGORIES = [
  'Kurti',
  'Kurti Set',
  'Plazo',
  'Co-ord Set',
  'Evening Gowns',
  'Sharara Set'
];

export const CATEGORY_SLUGS = {
  'Kurti': 'kurti',
  'Kurti Set': 'kurti-set',
  'Plazo': 'plazo',
  'Co-ord Set': 'co-ord-set',
  'Evening Gowns': 'evening-gowns',
  'Sharara Set': 'sharara-set'
};

export const SLUG_TO_CATEGORY = {
  'kurti': 'Kurti',
  'kurti-set': 'Kurti Set',
  'plazo': 'Plazo',
  'co-ord-set': 'Co-ord Set',
  'evening-gowns': 'Evening Gowns',
  'sharara-set': 'Sharara Set'
};

export const isValidCategory = (category) => {
  return PRODUCT_CATEGORIES.includes(category);
};

export const getCategorySlug = (category) => {
  return CATEGORY_SLUGS[category] || '';
};

export const getCategoryFromSlug = (slug) => {
  return SLUG_TO_CATEGORY[slug] || null;
};

export default {
  PRODUCT_CATEGORIES,
  CATEGORY_SLUGS,
  SLUG_TO_CATEGORY,
  isValidCategory,
  getCategorySlug,
  getCategoryFromSlug
};
