const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            count: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: 'Error al encontrar productos: ' + error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.status(200).json({
                success: true,
                data: product
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: 'Error al encontrar producto: ' + error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById
}
