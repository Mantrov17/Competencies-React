import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Импортируем Link
import styles from './LoginPage.module.scss';
import NavBar from "../NavBar/NavBar";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userId', data.userId);
                navigate('/workers-list-page');
            } else {
                setErrorMessage(data.message || 'Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Ошибка при входе');
        }
    };


    return (
        <div>
            <NavBar/>
            <div className={styles.loginPage}>

                <h2>Вход в систему</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    <button type="submit">Войти</button>
                </form>
                <p>
                    Нет аккаунта? <Link to="/registration-page">Зарегистрируйтесь здесь</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
