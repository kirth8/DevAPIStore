'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaTimes, FaCheck } from 'react-icons/fa';

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            const fetchOrders = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const { data } = await axios.get(`${apiUrl}/api/orders`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    setOrders(data.data);
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                    setLoading(false);
                }
            };
            fetchOrders();
        } else {
            router.push('/login');
        }
    }, [userInfo, router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Administración de Órdenes</h1>

            {loading ? (
                <p>Cargando órdenes...</p>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">USUARIO</th>
                                <th className="py-3 px-4 text-left">FECHA</th>
                                <th className="py-3 px-4 text-left">TOTAL</th>
                                <th className="py-3 px-4 text-left">PAGADO</th>
                                <th className="py-3 px-4 text-left">ENTREGADO</th>
                                <th className="py-3 px-4 text-left">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{order._id.substring(20, 24)}</td>
                                    <td className="py-3 px-4">{order.user && order.user.userName}</td>
                                    <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-3 px-4">${order.totalPrice}</td>
                                    <td className="py-3 px-4">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-bold">{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-600" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.isDelivered ? (
                                            <span className="text-green-600 font-bold">{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-600" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link href={`/order/${order._id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition">
                                            Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
