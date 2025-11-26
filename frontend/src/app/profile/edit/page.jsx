'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../../slices/authSlice';
export default function EditProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        } else {
            setName(userInfo.userName);
            setEmail(userInfo.email);
        }
    }, [userInfo, router]);
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            return;
        }
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.put(
                `${apiUrl}/api/users/profile`,
                { userName: name, email, password },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch(setCredentials(res.data.data));
            alert('Perfil actualizado correctamente');
            router.push('/profile'); // Redireccionar al perfil/home
        } catch (err) {
            setMessage(err.response?.data?.message || err.message);
        }
    };
    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
            {message && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</div>}

            <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nueva Contraseña (Opcional)</label>
                    <input
                        type="password"
                        placeholder="Dejar en blanco para no cambiar"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}