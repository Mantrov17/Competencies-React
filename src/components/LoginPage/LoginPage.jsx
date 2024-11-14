import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./LoginPage.module.scss"

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, accessToken, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken) {
            navigate('/workers-list-page');
        }
    }, [accessToken, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div>

            <div className={styles.loginPage}>
                <h2>Вход</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {status === 'loading' && <p className={styles.enterMessage}>Вход...</p>}
                    {error && <p className={styles.errorMessage}>Ошибка: Неверный логин или пароль</p>}
                    <button type="submit">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
