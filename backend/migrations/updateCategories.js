/**
 * Database Migration Script: Update Product Categories
 * 
 * This script:
 * 1. Updates all products with invalid categories to the first valid category (Kurti)
 * 2. Can be run manually to clean up the database before deploying the new category restrictions
 * 
 * Usage:
 *   node backend/migrations/updateCategories.js
 */

import mongoose from 'mongoose';
import ProductModel from '../models/ProductModel.js';
import { PRODUCT_CATEGORIES } from '../constants/categories.js';

const VALID_CATEGORIES = new Set(PRODUCT_CATEGORIES);
const DEFAULT_CATEGORY = PRODUCT_CATEGORIES[0]; // 'Kurti'

async function migrateCategories() {
  try {
    console.log('🔄 Starting category migration...');
    console.log(`Valid categories: ${Array.from(VALID_CATEGORIES).join(', ')}`);
    console.log(`Default category for invalid: ${DEFAULT_CATEGORY}`);
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find all products with invalid categories
    const invalidProducts = await ProductModel.find({
      category: { $nin: Array.from(VALID_CATEGORIES) }
    });

    console.log(`\n📊 Found ${invalidProducts.length} products with invalid categories`);

    if (invalidProducts.length > 0) {
      console.log('\n🔍 Invalid categories found:');
      const invalidCats = [...new Set(invalidProducts.map(p => p.category))];
      invalidCats.forEach(cat => {
        const count = invalidProducts.filter(p => p.category === cat).length;
        console.log(`  - "${cat}": ${count} products`);
      });

      // Update all invalid products to default category
      const result = await ProductModel.updateMany(
        { category: { $nin: Array.from(VALID_CATEGORIES) } },
        { category: DEFAULT_CATEGORY },
        { multi: true }
      );

      console.log(`\n✅ Updated ${result.modifiedCount} products to category "${DEFAULT_CATEGORY}"`);
    } else {
      console.log('✅ No products with invalid categories found');
    }

    // Verify all products now have valid categories
    const allProducts = await ProductModel.find();
    const validCount = allProducts.filter(p => VALID_CATEGORIES.has(p.category)).length;
    
    console.log(`\n📈 Verification: ${validCount}/${allProducts.length} products have valid categories`);

    if (validCount === allProducts.length) {
      console.log('✨ Migration completed successfully!');
    } else {
      console.log('⚠️  Some products still have invalid categories');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
migrateCategories();
