import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.scss';
import NavBar from "../NavBar/NavBar";

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                navigate('/login');
            } else {
                setMessage(data.message || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Ошибка при регистрации');
        }
    };

    return (
        <div>
            <NavBar/>
            <div className={styles.registrationPage}>

                <h2>Регистрация</h2>
                <form onSubmit={handleRegistration}>
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
                    {message && <p className={styles.message}>{message}</p>}
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>

    );
};

export default RegistrationPage;
