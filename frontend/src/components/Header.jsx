'use client';

import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useRouter } from 'next/navigation';
import SearchBox from './SearchBox';
import { useState, useEffect } from 'react';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <header className="bg-gray-900 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-400">
                    DevAPIStore
                </Link>

                {/* Buscador */}
                <div className="hidden md:flex flex-1 max-w-lg mx-6">
                    <SearchBox />
                </div>

                {/* Menú Usuario */}
                <div className="flex items-center space-x-6">
                    <Link href="/cart" className="flex items-center hover:text-blue-400 transition">
                        <FaShoppingCart className="mr-1" />
                        Cart
                    </Link>

                    {mounted && userInfo ? (
                        <div className="flex items-center space-x-4">
                            {/* Botones Admin */}
                            {userInfo.isAdmin && (
                                <>
                                    <Link
                                        href="/admin/productlist"
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        Productos
                                    </Link>
                                    <Link
                                        href="/admin/orderlist"
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        Órdenes
                                    </Link>
                                </>
                            )}
                            {/* Enlace al Perfil */}
                            <Link href="/profile" className="text-blue-400 font-semibold hover:text-blue-300">
                                Hola, {userInfo.userName}
                            </Link>
                            <button
                                onClick={logoutHandler}
                                className="flex items-center text-red-400 hover:text-red-300 transition"
                            >
                                <FaSignOutAlt className="mr-1" />
                                Salir
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center hover:text-blue-400 transition">
                            <FaUser className="mr-1" />
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;