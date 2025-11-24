'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../../slices/cartSlice';
import { useRouter } from 'next/navigation';
export default function CartPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };
    const checkoutHandler = () => {
        // Si no está logueado, lo mandamos al login, y luego a 'shipping'
        router.push('/login?redirect=/shipping');
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
                    Tu carrito está vacío. <Link href="/" className="font-bold underline ml-2">Volver a la tienda</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de Productos */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                                <img
                                    src={item.image.startsWith('http') ? item.image : `${apiUrl}${item.image}`}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded mr-4"
                                />

                                <div className="flex-1">
                                    <Link href={`/product/${item._id}`} className="text-lg font-semibold hover:text-blue-600">
                                        {item.name}
                                    </Link>
                                    <p className="text-gray-600">${item.price}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                        className="border rounded px-2 py-1"
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => removeFromCartHandler(item._id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Resumen de Compra */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-bold mb-4">Resumen</h2>

                        <div className="space-y-2 mb-4 border-b pb-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span>${itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span>${shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Impuestos (15%)</span>
                                <span>${taxPrice}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xl font-bold mb-6">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}