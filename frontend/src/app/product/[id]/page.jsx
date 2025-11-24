import axios from 'axios';
import Link from 'next/link';
import { FaArrowLeft, FaStar, FaShoppingCart } from 'react-icons/fa';
// Función para obtener un solo producto
async function getProduct(id) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { data } = await axios.get(`${apiUrl}/api/products/${id}`);
        return data.data;
    } catch (error) {
        return null;
    }
}
export default async function ProductPage({ params }) {
    // En Next.js 15+, params es una promesa, así que hay que esperar a que se resuelva
    // Si usas Next.js 14 o anterior, puedes usar params.id directamente.
    // Como instalamos la última versión (15+), hacemos esto:
    const { id } = await params;

    const product = await getProduct(id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Producto no encontrado</h1>
                <Link href="/" className="text-blue-600 hover:underline mt-4 block">
                    Volver a la tienda
                </Link>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
                <FaArrowLeft className="mr-2" /> Volver
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen del Producto */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                        src={product.image.startsWith('http') ? product.image : `${apiUrl}${product.image}`}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                    />
                </div>
                {/* Detalles del Producto */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <span className="text-gray-600">({product.numReviews} reviews)</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        {product.description}
                    </p>
                    {/* Caja de Compra */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-700">Precio:</span>
                            <span className="text-xl font-bold">${product.price}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-semibold text-gray-700">Estado:</span>
                            <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {product.countInStock > 0 ? 'En Stock' : 'Agotado'}
                            </span>
                        </div>
                        <button
                            className={`w-full flex items-center justify-center py-3 rounded-lg text-white font-semibold transition
                ${product.countInStock > 0
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"}`}
                            disabled={product.countInStock === 0}
                        >
                            <FaShoppingCart className="mr-2" />
                            {product.countInStock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}