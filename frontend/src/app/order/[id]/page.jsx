'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function OrderPage() {
    const { id: orderId } = useParams(); // Obtenemos el ID de la URL
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
            return;
        }
        const fetchOrder = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const { data } = await axios.get(`${apiUrl}/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                setOrder(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, userInfo, router]);
    if (loading) return <p className="p-4">Cargando orden...</p>;
    if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Orden {order._id}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Envío</h2>
                        <p className="mb-2">
                            <strong>Nombre: </strong> {order.user.userName}
                        </p>
                        <p className="mb-2">
                            <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p className="mb-4">
                            <strong>Dirección: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-800 p-3 rounded">
                                Entregado el {order.deliveredAt?.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-800 p-3 rounded">
                                No Entregado
                            </div>
                        )}
                    </div>
                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
                        <p className="mb-4">
                            <strong>Método: </strong> {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-800 p-3 rounded">
                                Pagado el {order.paidAt?.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-800 p-3 rounded">
                                No Pagado
                            </div>
                        )}
                    </div>
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Items de la Orden</h2>
                        {order.orderItems.length === 0 ? (
                            <p>La orden está vacía</p>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div className="flex-1">
                                            <Link href={`/product/${item.product}`} className="text-blue-600 hover:underline">
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
                    <h2 className="text-xl font-bold mb-6">Resumen de Orden</h2>
                    <div className="space-y-3 border-b pb-4 mb-4">
                        <div className="flex justify-between">
                            <span>Items</span>
                            <span>${order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Envío</span>
                            <span>${order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Impuesto</span>
                            <span>${order.taxPrice}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                    </div>

                    {/* Aquí iría el botón de PayPal en el futuro */}
                    {!order.isPaid && (
                        <button className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg cursor-not-allowed font-semibold">
                            Pagar (Próximamente)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}