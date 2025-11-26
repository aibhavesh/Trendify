import Product from '../../models/ProductModel.js';

export const deleteProductController = async (req, res) => {
    try{
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
 
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });

    }catch(error){
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}