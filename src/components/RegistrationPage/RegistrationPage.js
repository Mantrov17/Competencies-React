import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice'; // Corrected import
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.scss'
import NavBar from "../NavBar/NavBar";

const RegistrationPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {status, error} = useSelector((state) => state.auth);

    const handleRegistration = (e) => {
        e.preventDefault();
        dispatch(registerUser({firstName, lastName, email, password}))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                console.error('Ошибка регистрации:', err);
            });
    };

    return (
        <div>
            <NavBar/>
            <div className={styles.registrationPage}>
                <h2>Регистрация</h2>
                <form onSubmit={handleRegistration}>
                    <div>
                        <label>Имя:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Фамилия:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
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
                    {status === 'loading' && <p>Регистрация...</p>}
                    {error && <p className={styles.errorMessage}>Ошибка: Неверный логин или пароль</p>}
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
