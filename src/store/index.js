import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // Добавьте другие редьюсеры здесь
    },
});

export default store;
