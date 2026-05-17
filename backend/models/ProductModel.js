import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../constants/categories.js";

const productSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        description : {
            type: String,
            required: [true, "Product description is required"],
        },
        price : {
            type: Number,
            required : [true, "Product price is required"],
            min : [0, "Price cannot be negative"],
        },
        discountPercent: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"],
            max: [90, "Discount cannot exceed 90%"],
        },
        category : {
            type : String,
            trim : true,
            required: [true, "Category is required"],
            enum: {
                values: PRODUCT_CATEGORIES,
                message: `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`
            }
        },
        tags : {
            type : [String],
            default : [],
        },
        images :{
            type : [String],
            default : [],       
        },
        sizes: {
            type: [String],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        stock : {
            type : Number,
            default : 0,
            min : [0, "Stock cannot be negative"],
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
        },
        isTrending : {
            type : Boolean,
            default : false,
        },
        isNewArrival : {
            type : Boolean,
            default : false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        averageRating: {
            type: Number,
            default: 0
        }
    },
    {timestamps : true }
);

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ isTrending: 1, isFeatured: 1, isBestSeller: 1, isNewArrival: 1 });
productSchema.index({ title: "text", description: "text", tags: "text", category: "text" });

// Prevent OverwriteModelError in development
const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;