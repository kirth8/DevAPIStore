'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
const ReviewSection = ({ product, onReviewAdded }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { userInfo } = useSelector((state) => state.auth);
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(
                `${apiUrl}/api/products/${product._id}/reviews`,
                { comment },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            alert('Review enviada con éxito');
            setComment('');
            window.location.reload(); // Recarga automática
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    const deleteHandler = async () => {
        if (window.confirm('¿Estás seguro de borrar tu comentario?')) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                await axios.delete(
                    `${apiUrl}/api/products/${product._id}/reviews`,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );
                alert('Comentario eliminado');
                window.location.reload(); // Recarga automática
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Comentarios del Producto</h2>
            {/* Lista de Reviews */}
            {product.reviews.length === 0 && <div className="bg-blue-50 text-blue-700 p-4 rounded mb-6">No hay comentarios aún.</div>}
            <div className="space-y-4 mb-8">
                {product.reviews.map((review) => (
                    <div key={review._id} className="bg-white p-4 rounded shadow-sm border">
                        <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <strong className="text-gray-800">{review.name}</strong>
                                {/* Botón Eliminar si es mi review */}
                                {userInfo && review.user === userInfo._id && (
                                    <button
                                        onClick={deleteHandler}
                                        className="text-red-500 text-xs hover:underline font-semibold"
                                    >
                                        (Eliminar)
                                    </button>
                                )}
                            </div>
                            <span className="text-gray-500 text-sm">{review.createdAt.substring(0, 10)}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
            {/* Formulario */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4 gap-2">
                    <h3 className="text-xl font-bold">Escribe un comentario</h3>
                    <span className="text-sm text-gray-500">(Solo podrás si ya recibiste el producto)</span>
                </div>

                {userInfo ? (
                    <form onSubmit={submitHandler}>
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Comentario</label>
                            <textarea
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                placeholder="Comparte tu experiencia con el producto..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Enviando...' : 'Enviar Comentario'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded">
                        Por favor <Link href="/login" className="underline font-bold">inicia sesión</Link> para escribir un comentario.
                    </div>
                )}
            </div>
        </div>
    );
};
export default ReviewSection;