import { createSlice } from '@reduxjs/toolkit';
const initialState = typeof window !== 'undefined' && localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            // Calcular precios
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );

            // Envío: Si compra más de $100 es gratis, si no $10
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

            // Impuesto (ejemplo 15%)
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

            // Total Final
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            // Recalcular precios (copiar lógica de arriba o extraer función)
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});
export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;