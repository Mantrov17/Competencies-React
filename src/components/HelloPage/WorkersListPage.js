import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import NavBar from "../NavBar/NavBar"; // Импорт apiFetch для автоматизации заголовков

const WorkersListPage = () => {
    const [profiles, setProfiles] = useState([]);
    const { user, accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Проверка, есть ли accessToken
        if (!accessToken) {
            navigate('/');
            return;
        }

        // Функция загрузки списка пользователей
        const fetchProfiles = async () => {
            try {
                const data = await apiFetch('http://localhost:8080/users/');
                setProfiles(data);
            } catch (error) {
                console.error('Ошибка при загрузке профилей:', error);
            }
        };

        fetchProfiles();
    }, [accessToken, navigate]);

    // Обработка выхода из аккаунта
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div>
            <NavBar/>
            <h2>Список работников</h2>
            {user && (
                <div>
                    <p>Вы вошли как: {user.firstName} {user.lastName}</p>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id}>
                        <Link to={`/profile-info/${profile.id}`}>
                            {profile.firstName} {profile.lastName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkersListPage;
