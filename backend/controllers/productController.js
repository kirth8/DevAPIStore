const Product = require('../models/Product');
const Order = require('../models/Order');

const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const products = await Product.find({ ...keyword });

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

const createProduct = async (req, res) => {
    try {
        // Creamos un producto "vacío" o con datos por defecto para editarlo luego
        // O podemos recibir los datos del body directamente
        const { name, price, description, image, category, countInStock, characteristics } = req.body;
        const product = new Product({
            name,
            price,
            description,
            image,
            category,
            countInStock,
            characteristics
        });
        const createdProduct = await product.save();
        res.status(201).json({ success: true, data: createdProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear producto: ' + error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock, characteristics } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            product.characteristics = characteristics || product.characteristics;
            const updatedProduct = await product.save();
            res.json({ success: true, data: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al actualizar: ' + error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ success: true, message: 'Producto eliminado' });
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar: ' + error.message });
    }
};

const createProductReview = async (req, res) => {
    const { comment } = req.body; // Solo pedimos el comentario, nada de rating
    const product = await Product.findById(req.params.id);
    if (product) {
        // Verificar si ya comentó
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Ya has comentado este producto');
        }
        const orders = await Order.find({
            user: req.user._id,
            isPaid: true,
            isDelivered: true, // Solo si ya le llegó
            'orderItems.product': req.params.id
        });
        if (orders.length === 0) {
            res.status(400);
            throw new Error('Debes comprar y recibir este producto para poder opinar.');
        }
        // Crear la review
        const review = {
            name: req.user.userName,
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review añadida' });
    } else {
        res.status(404);
        throw new Error('Producto no encontrado');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
}
