import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import styles from './RegistrationPage.module.scss';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [professions, setProfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const data = await apiFetch('http://localhost:8081/professions/all');
                setProfessions(data);
            } catch (error) {
                console.error('Ошибка при загрузке профессий:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessions();
    }, []);

    const handleRegistration = (e) => {
        e.preventDefault();

        if (!formData.dateOfBirth || !formData.city || !formData.gender || !formData.professionId) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        let genderValue = '';
        if (formData.gender === 'Мужской') {
            genderValue = 'MALE';
        } else if (formData.gender === 'Женский') {
            genderValue = 'FEMALE';
        } else {
            alert("Пожалуйста, выберите пол.");
            return;
        }

        const profession = professions.find(prof => prof.id === parseInt(formData.professionId));

        const dataToSend = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            city: formData.city,
            gender: genderValue,
            dateOfBirth: formData.dateOfBirth,
            profession: profession ? { id: profession.id, name: profession.name } : null,
            roles: ['ROLE_USER'],
        };

        console.log("Отправка данных на сервер:", dataToSend);

        dispatch(registerUser(dataToSend))
            .unwrap()
            .then(() => {
                setSuccessMessage('Пользователь успешно зарегистрирован!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    city: '',
                    gender: '',
                    dateOfBirth: '',
                    professionId: '',
                });
            })
            .catch((err) => {
                console.error('Ошибка регистрации:', err);
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    if (loading) {
        return (
            <div style={{paddingTop: '60px'}}>
                <NavBar/>
                <p>Загрузка данных...</p>
            </div>
        );
    }
    return (
        <div>
            <NavBar />
            <div className={styles.registrationPage}>
                <h2>Регистрация нового пользователя</h2>
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <form onSubmit={handleRegistration}>
                    <div>
                        <label>Имя:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Фамилия:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Город:</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Пол:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите пол</option>
                            <option value="Мужской">Мужской</option>
                            <option value="Женский">Женский</option>
                        </select>
                    </div>
                    <div>
                        <label>Дата рождения:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {status === 'loading' && <p>Регистрация...</p>}
                    {error && <p className={styles.errorMessage}>Ошибка: {error}</p>}
                    <button type="submit">Зарегистрировать</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
