'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
export default function SearchBox() {
    const [keyword, setKeyword] = useState('');
    const router = useRouter();
    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/?keyword=${keyword}`);
        } else {
            router.push('/');
        }
    };
    return (
        <form onSubmit={submitHandler} className="relative w-full max-w-md">
            <div className="relative flex items-center w-full h-10 rounded-full focus-within:shadow-lg bg-gray-800 overflow-hidden border border-gray-700 transition-shadow duration-300">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                    <FaSearch />
                </div>
                <input
                    className="peer h-full w-full outline-none text-sm text-white bg-transparent pr-4 placeholder-gray-400"
                    type="text"
                    name="q"
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Buscar productos..."
                />
            </div>
        </form>
    );
}