'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { saveShippingAddress } from '../../slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';
export default function ShippingPage() {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const dispatch = useDispatch();
    const router = useRouter();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        router.push('/payment');
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 />

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Postal Code</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}