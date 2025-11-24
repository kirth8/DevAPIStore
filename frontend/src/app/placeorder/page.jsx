'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../../components/CheckoutSteps';
import axios from 'axios';

export default function PlaceOrderPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state) => state.cart);

    // Si no hay envío, volver a shipping
    useEffect(() => {
        if (!cart.shippingAddress.address) {
            router.push('/shipping');
        } else if (!cart.paymentMethod) {
            router.push('/payment');
        }
    }, [cart, router]);

    const placeOrderHandler = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const { data } = await axios.post(
                `${apiUrl}/api/orders`,
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
                    },
                }
            );

            alert('Orden creada con éxito (Simulación)');
            // router.push(`/order/${data._id}`); 

        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 step4 />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${apiUrl}${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div className="flex-1">
                                            <Link href={`/product/${item._id}`} className="text-blue-600 hover:underline">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-3 border-b pb-4 mb-4">
                        <div className="flex justify-between">
                            <span>Items</span>
                            <span>${cart.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${cart.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${cart.taxPrice}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        onClick={placeOrderHandler}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}