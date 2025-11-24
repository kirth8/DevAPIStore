'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { FaShoppingCart } from 'react-icons/fa';
const AddToCart = ({ product }) => {
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        alert('Producto añadido al carrito'); // Feedback simple por ahora
    };
    return (
        <>
            {product.countInStock > 0 && (
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">Cantidad:</span>
                    <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="border rounded px-2 py-1 bg-white"
                    >
                        {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button
                onClick={addToCartHandler}
                className={`w-full flex items-center justify-center py-3 rounded-lg text-white font-semibold transition
          ${product.countInStock > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"}`}
                disabled={product.countInStock === 0}
            >
                <FaShoppingCart className="mr-2" />
                {product.countInStock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
            </button>
        </>
    );
};
export default AddToCart;