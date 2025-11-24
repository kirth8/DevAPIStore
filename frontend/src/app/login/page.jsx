'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../slices/authSlice';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    // Obtenemos el usuario del estado global
    const { userInfo } = useSelector((state) => state.auth);
    // Si ya está logueado, lo mandamos al home
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [userInfo, router]);
    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            // Hacemos la petición de Login
            const { data } = await axios.post(`${apiUrl}/api/users/login`, {
                email,
                password,
            });
            // Si todo sale bien, guardamos en Redux y localStorage
            dispatch(setCredentials(data.data));
            router.push('/');

        } catch (err) {
            // Mostramos el error si falla (ej: contraseña incorrecta)
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Inicia Sesión
                    </h2>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                type="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}