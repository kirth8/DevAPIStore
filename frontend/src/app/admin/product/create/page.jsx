'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
export default function CreateProductPage() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false); // Estado para mostrar "Cargando..."
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
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

            // El backend devuelve algo como "/uploads/image-123.jpg"
            // Necesitamos asegurarnos de que sea una URL completa o relativa válida
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
            await axios.post(
                `${apiUrl}/api/products`,
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
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/productlist" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
                <FaArrowLeft className="mr-2" /> Volver
            </Link>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>

                <form onSubmit={submitHandler} className="space-y-4">
                    {/* ... inputs de Nombre y Precio iguales ... */}
                    <div>
                        <label className="block text-gray-700 mb-2">Nombre</label>
                        <input type="text" required className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Precio</label>
                        <input type="number" required className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                    {/* INPUT DE IMAGEN MODIFICADO */}
                    <div>
                        <label className="block text-gray-700 mb-2">Imagen</label>
                        <input
                            type="text"
                            required
                            placeholder="URL de la imagen"
                            className="w-full border rounded px-3 py-2 mb-2"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            readOnly // Lo hacemos de solo lectura para obligar a usar el upload (opcional)
                        />
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
                        />
                        {uploading && <p className="text-sm text-blue-500 mt-1">Subiendo imagen...</p>}
                    </div>
                    {/* ... resto de inputs iguales ... */}
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
                        Crear Producto
                    </button>
                </form>
            </div>
        </div>
    );
}