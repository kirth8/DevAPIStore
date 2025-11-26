'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
import { FaTimes, FaUserEdit } from 'react-icons/fa';
export default function ProfilePage() {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const { data } = await axios.get(`${apiUrl}/api/orders/myorders`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    setOrders(data.data);
                    setLoadingOrders(false);
                } catch (error) {
                    console.error(error);
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [userInfo, router]);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mi Perfil</h1>
                <Link href="/profile/edit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition">
                    <FaUserEdit className="mr-2" /> Editar Datos
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Mis Datos</h2>
                <p><strong>Nombre:</strong> {userInfo?.userName}</p>
                <p><strong>Email:</strong> {userInfo?.email}</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Mis Pedidos</h2>
            {loadingOrders ? (
                <p>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-4 rounded">
                    No has realizado pedidos aún.
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">FECHA</th>
                                <th className="py-3 px-4 text-left">TOTAL</th>
                                <th className="py-3 px-4 text-left">PAGADO</th>
                                <th className="py-3 px-4 text-left">ENTREGADO</th>
                                <th className="py-3 px-4 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{order._id.substring(20, 24)}</td>
                                    <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-3 px-4 font-bold">${order.totalPrice}</td>
                                    <td className="py-3 px-4">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-bold">Sí</span>
                                        ) : (
                                            <FaTimes className="text-red-600" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.isDelivered ? (
                                            <span className="text-green-600 font-bold">Sí</span>
                                        ) : (
                                            <FaTimes className="text-red-600" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link href={`/order/${order._id}`} className="text-blue-600 hover:underline">
                                            Ver Detalles
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