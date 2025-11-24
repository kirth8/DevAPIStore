import ProductCard from '../components/ProductCard';
import axios from 'axios';
// Función para pedir los datos al Backend
async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const { data } = await axios.get(`${apiUrl}/api/products`);
    return data.data; // Devolvemos el array de productos
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
export default async function Home() {
  const products = await getProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Últimos Productos</h1>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}