'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditProductPage() {
    const { id: productId } = useParams();
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            router.push('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const { data } = await axios.get(`${apiUrl}/api/products/${productId}`);
                const product = data.data;

                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                alert('Error al cargar producto');
            }
        };

        fetchProduct();
    }, [productId, userInfo, router]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(`${apiUrl}/api/uploads`, formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Error al subir imagen');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.put(
                `${apiUrl}/api/products/${productId}`,
                {
                    name,
                    price,
                    image,
                    category,
                    countInStock,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            router.push('/admin/productlist');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    if (loading) return <p className="p-8">Cargando...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/productlist" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
                <FaArrowLeft className="mr-2" /> Volver
            </Link>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Nombre</label>
                        <input type="text" required className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Precio</label>
                        <input type="number" required className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Imagen</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 mb-2"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            readOnly
                        />
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
                        />
                        {uploading && <p className="text-sm text-blue-500 mt-1">Subiendo imagen...</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Categoría</label>
                        <input type="text" required className="w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Stock</label>
                        <input type="number" required className="w-full border rounded px-3 py-2" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Descripción</label>
                        <textarea required className="w-full border rounded px-3 py-2 h-32" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-bold"
                    >
                        Actualizar Producto
                    </button>
                </form>
            </div>
        </div>
    );
}
