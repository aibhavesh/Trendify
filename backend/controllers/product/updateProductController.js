import Product from '../../models/ProductModel.js';


export const updateProductController = async (req, res) => {
    try{
        const productId = req.params.id;


        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ success: false, message: 'Product not found' });
    }


    product.name = req.body.title  ?? product.title;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;


    if (req.body.tags){
        product.tags =Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim());
    }

    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
    }catch(error){
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}