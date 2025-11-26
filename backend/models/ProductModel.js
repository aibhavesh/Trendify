import mongoose from "mongoose";

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
        category : {
            type : String,
            trim : true,
            default : "uncategorized",
        },
        tags : {
            type : [String],
            default : [],
        },
        images :{
            type : [String],
            default : [],       
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
        },reviews: [
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
},


    },
    {timestamps : true }
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;