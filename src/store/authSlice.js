// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return thunkAPI.rejectWithValue(errorText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return thunkAPI.rejectWithValue(errorText);
            }
            const data = await response.json();
            console.log('Данные, полученные при авторизации:', data);
            const { accessToken, roleType, userId } = data;

            // Сохраняем данные в localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('roleType', roleType);
            localStorage.setItem('userId', userId);

            return {
                accessToken,
                roleType,
                userId,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    roleType: localStorage.getItem('roleType') || null,
    userId: localStorage.getItem('userId') || null,
    status: 'idle',
    profilePhoto: null, // Добавляем начальное значение для фото профиля
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateProfilePhoto: (state, action) => {
            console.log("Обновляем фото профиля с URL:", action.payload); // Лог для проверки
            state.profilePhoto = action.payload;
        },
        logout: (state) => {
            state.userId = null;
            state.roleType = null;
            state.profilePhoto = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('roleType');
            localStorage.removeItem('userId');
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                state.roleType = action.payload.roleType;
                state.userId = action.payload.userId;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { updateProfilePhoto, logout } = authSlice.actions;
export default authSlice.reducer;
