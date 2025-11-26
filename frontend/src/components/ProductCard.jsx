import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/product/${product._id}`}>
                {/* Nota: Usamos la URL del backend para la imagen */}
                <img
                    src={product.image.startsWith('http') ? product.image : `${apiUrl}${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link href={`/product/${product._id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate">
                        {product.name}
                    </h2>
                </Link>

                <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                        {/* Truco para pintar estrellas según el rating */}
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">{product.numReviews} reviews</span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;