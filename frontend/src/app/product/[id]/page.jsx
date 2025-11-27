import axios from 'axios';
import Link from 'next/link';
import AddToCart from '../../../components/AddToCart';
import { FaArrowLeft } from 'react-icons/fa';
import ReviewSection from '../../../components/ReviewSection';

async function getProduct(id) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const { data } = await axios.get(`${apiUrl}/api/products/${id}`);
        return data.data;
    } catch (error) {
        return null;
    }
}
export default async function ProductPage({ params }) {
    // En Next.js 15+, params también es una promesa
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) {
        return <div className="p-8">Producto no encontrado</div>;
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
                <FaArrowLeft className="mr-2" /> Volver
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen */}
                <div>
                    <img
                        src={product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                        alt={product.name}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                {/* Detalles */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl text-blue-600 font-bold mb-4">${product.price}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">Precio:</span>
                            <span>${product.price}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">Estado:</span>
                            <span>{product.countInStock > 0 ? 'En Stock' : 'Agotado'}</span>
                        </div>
                        {product.countInStock > 0 && (
                            <AddToCart product={product} />
                        )}
                    </div>
                </div>
            </div>
            <ReviewSection product={product} />
        </div>
    );
}