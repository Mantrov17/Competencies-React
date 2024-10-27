import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from './ProfileInfo.module.scss';
import { apiFetch } from '../../utils/api'; // Централизованный метод API

const ProfileInfo = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Индикатор загрузки

    // Получение данных пользователя по ID
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Используем apiFetch для автоматического добавления заголовка Authorization
                const data = await apiFetch(`http://localhost:8080/users/${id}`);
                setUser(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя:", error);
            } finally {
                setLoading(false); // Отключаем индикатор загрузки после завершения запроса
            }
        };

        fetchUserData();
    }, [id]);

    // Если данные еще загружаются
    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    // Если данные пользователя отсутствуют (например, пользователь с таким ID не найден)
    if (!user) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <div className={styles.profilePage}>
            <NavBar />
            <div className={styles.profileBox}>
                <h2 className={styles.headerText}>{user.firstName} {user.lastName}</h2>
                <p>Город: {user.city}</p>
                <p>Профессия: {user.profession?.name}</p>
                <p>Дата рождения: {user.dateOfBirth}</p>
                <p>Пол: {user.gender}</p>
                <div className={styles.rating}>
                    {/* Добавьте логику для отображения среднего рейтинга, если доступно */}
                </div>
            </div>
            <div className={styles.rateButtons}>
                <Link to={`/hard-skills/${id}`}>
                    <button>Оценить Hard Скиллы</button>
                </Link>
                <Link to={`/soft-skills/${id}`}>
                    <button>Оценить Soft Скиллы</button>
                </Link>
            </div>
        </div>
    );
};

export default ProfileInfo;
