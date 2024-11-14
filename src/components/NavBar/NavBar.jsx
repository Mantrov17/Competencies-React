import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { apiFetch } from '../../utils/api';
import styles from './NavBar.module.scss';

const NavBar = () => {
    const roleType = useSelector((state) => state.auth.roleType);
    const userId = useSelector((state) => state.auth.userId);
    const profilePhoto = useSelector((state) => state.auth.profilePhoto);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentUserPhoto, setCurrentUserPhoto] = useState(null);
    const [error, setError] = useState(null);  // состояние для ошибок
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/current/photo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response && response.ok) {
                    setCurrentUserPhoto(URL.createObjectURL(await response.blob()));
                } else {
                    console.error("Ошибка при загрузке фото текущего пользователя:", response ? response.status : "Нет ответа");

                }
            } catch (error) {
                console.error("Ошибка при загрузке фото текущего пользователя:", error);
            }
        };
        fetchPhoto();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className={styles.navBar}>
            {error && <p className={styles.error}>{error}</p>}
            {userId && (
                <Link to={`/profile-info/${userId}`} className={styles.myProfileButton}>
                    {currentUserPhoto ? (
                        <img src={currentUserPhoto} alt="Профиль" className={styles.profileImage} />
                    ) : (
                        <img src="https://cdn-icons-png.flaticon.com/512/12225/12225773.png" alt="Профиль" className={styles.profileImage} />
                    )}
                </Link>
            )}
            <Link to="/workers-list-page" className={styles.usersRateButton}>Сотрудники</Link>

            {roleType === 'ROLE_ADMIN' ? (
                <div
                    className={styles.dropdown}
                    onMouseEnter={() => setShowAdminMenu(true)}
                    onMouseLeave={() => setShowAdminMenu(false)}
                >
                    <span className={styles.usersRateButton}>Админ-панель</span>
                    {showAdminMenu && (
                        <div className={styles.dropdownContent}>
                            <Link to="/admin-all-hard-skills" className={styles.usersRateButton}>Управление профессиями и навыками</Link>
                            <Link to="/registration-page" className={styles.usersRateButton}>Регистрация</Link>
                            <Link to="/admin-hard-skills" className={styles.usersRateButton}>Добавить Hard скиллы</Link>
                            <Link to="/admin-soft-skills" className={styles.usersRateButton}>Добавить Soft скиллы</Link>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/all-hard-skills" className={styles.usersRateButton}>Все Hard Скиллы</Link>
            )}

            <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
        </div>
    );
};

export default NavBar;
