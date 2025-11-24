import { createSlice } from '@reduxjs/toolkit';
// Intentamos leer del almacenamiento local si ya hay un usuario guardado
const initialState = {
    userInfo: typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            // Guardamos en localStorage para no perder la sesión al recargar
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;