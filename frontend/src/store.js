import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        // Aquí añadiremos el carrito (cartSlice) más adelante
    },
});
export default store;