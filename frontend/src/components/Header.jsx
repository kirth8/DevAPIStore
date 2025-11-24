import Link from 'next/link';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="bg-gray-900 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-400">
                    DevAPIStore
                </Link>

                {/* Buscador (Placeholder) */}
                <div className="hidden md:flex bg-gray-800 rounded-lg overflow-hidden">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="bg-transparent text-white px-4 py-2 outline-none w-64"
                    />
                    <button className="bg-blue-600 px-4 py-2 hover:bg-blue-700 transition">
                        Buscar
                    </button>
                </div>

                {/* Menú Usuario */}
                <div className="flex items-center space-x-6">
                    <Link href="/cart" className="flex items-center hover:text-blue-400 transition">
                        <FaShoppingCart className="mr-1" />
                        Cart
                    </Link>
                    <Link href="/login" className="flex items-center hover:text-blue-400 transition">
                        <FaUser className="mr-1" />
                        Sign In
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
