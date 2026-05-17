import Product from '../../models/ProductModel.js';
import { isValidCategory } from '../../constants/categories.js';

export const updateProductController = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const toArray = (value) => {
            if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
            if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
            return [];
        };

        product.title = req.body.title ?? product.title;
        product.description = req.body.description ?? product.description;
        
        if (req.body.price != null) {
            const normalizedPrice = Number(req.body.price);
            if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
                return res.status(400).json({ success: false, message: 'price must be a positive number' });
            }
            product.price = normalizedPrice;
        }
        
        if (req.body.category != null) {
            if (!isValidCategory(req.body.category)) {
                return res.status(400).json({ success: false, message: `Invalid category. Must be one of: Kurti, Kurti Set, Plazo, Co-ord Set, Evening Gowns, Sharara Set` });
            }
            product.category = req.body.category;
        }
        
        if (req.body.stock != null) {
            const normalizedStock = Number(req.body.stock);
            if (!Number.isFinite(normalizedStock) || normalizedStock < 0) {
                return res.status(400).json({ success: false, message: 'stock must be a positive number' });
            }
            product.stock = normalizedStock;
        }

        if (req.body.discountPercent != null) {
            const normalizedDiscount = Number(req.body.discountPercent);
            if (!Number.isFinite(normalizedDiscount) || normalizedDiscount < 0 || normalizedDiscount > 90) {
                return res.status(400).json({ success: false, message: 'discountPercent must be between 0 and 90' });
            }
            product.discountPercent = normalizedDiscount;
        }

        if (req.body.tags) {
            product.tags = toArray(req.body.tags);
        }

        if (req.body.images) {
            product.images = toArray(req.body.images);
        }

        if (req.body.sizes) {
            product.sizes = toArray(req.body.sizes);
        }

        if (req.body.colors) {
            product.colors = toArray(req.body.colors);
        }

        if (req.body.isTrending != null) {
            product.isTrending = Boolean(req.body.isTrending);
        }

        if (req.body.isNewArrival != null) {
            product.isNewArrival = Boolean(req.body.isNewArrival);
        }

        if (req.body.isFeatured != null) {
            product.isFeatured = Boolean(req.body.isFeatured);
        }

        if (req.body.isBestSeller != null) {
            product.isBestSeller = Boolean(req.body.isBestSeller);
        }

        await product.save();

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};