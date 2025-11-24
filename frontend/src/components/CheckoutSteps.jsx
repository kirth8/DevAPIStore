import Link from 'next/link';
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className="flex justify-center mb-8">
            <ol className="flex items-center space-x-4">
                <li>
                    {step1 ? (
                        <Link href="/login" className="text-blue-600 font-semibold">Sign In</Link>
                    ) : (
                        <span className="text-gray-400">Sign In</span>
                    )}
                </li>
                <li><span className="text-gray-400">{'>'}</span></li>
                <li>
                    {step2 ? (
                        <Link href="/shipping" className="text-blue-600 font-semibold">Shipping</Link>
                    ) : (
                        <span className="text-gray-400">Shipping</span>
                    )}
                </li>
                <li><span className="text-gray-400">{'>'}</span></li>
                <li>
                    {step3 ? (
                        <Link href="/payment" className="text-blue-600 font-semibold">Payment</Link>
                    ) : (
                        <span className="text-gray-400">Payment</span>
                    )}
                </li>
                <li><span className="text-gray-400">{'>'}</span></li>
                <li>
                    {step4 ? (
                        <Link href="/placeorder" className="text-blue-600 font-semibold">Place Order</Link>
                    ) : (
                        <span className="text-gray-400">Place Order</span>
                    )}
                </li>
            </ol>
        </nav>
    );
};
export default CheckoutSteps;