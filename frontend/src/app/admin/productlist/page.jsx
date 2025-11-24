'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
export default function ProductListPage() {
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            router.push('/login');
        } else {
            fetchProducts();
        }
    }, [userInfo, router]);
    const fetchProducts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const { data } = await axios.get(`${apiUrl}/api/products`);
            setProducts(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    const deleteHandler = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                await axios.delete(`${apiUrl}/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                // Recargar productos
                fetchProducts();
            } catch (error) {
                alert(error.response?.data?.message || error.message);
            }
        }
    };
    const createProductHandler = async () => {
        router.push('/admin/product/create');
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Productos</h1>
                <button
                    onClick={createProductHandler}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition"
                >
                    <FaPlus className="mr-2" /> Crear Producto
                </button>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {product._id}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {product.name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        ${product.price}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {product.category}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex space-x-3">
                                            <Link
                                                href={`/admin/product/${product._id}/edit`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
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