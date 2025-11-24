'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { savePaymentMethod } from '../../slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';
export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    useEffect(() => {
        if (!shippingAddress?.address) {
            router.push('/shipping');
        }
    }, [shippingAddress, router]);
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        router.push('/placeorder');
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 />

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Payment Method</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Select Method</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="PayPal"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="PayPal" className="ml-2 block text-gray-700">
                                    PayPal or Credit Card
                                </label>
                            </div>
                            {/* Aquí podrías añadir más opciones como 'Stripe' */}
                        </div>
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