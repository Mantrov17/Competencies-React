import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from './ProfileInfo.module.scss';
import { apiFetch } from '../../utils/api';
import { useDispatch, useSelector } from 'react-redux';

const ProfileInfo = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);
    const currentUserId = useSelector((state) => state.auth.userId);
    const roleType = useSelector((state) => state.auth.roleType);
    const dispatch = useDispatch();

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await apiFetch(`http://localhost:8081/users/${id}/upload-photo`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                const responseText = await response.text();
                if (response.ok || responseText.includes("Фотография успешно загружена")) {
                    window.location.reload();
                } else {
                    console.error(`Ошибка при загрузке фото: ${response.status} - ${response.statusText}`);
                    console.error('Текст ошибки:', responseText);
                }
            } catch (error) {
                console.error("Сетевая ошибка при загрузке фото:", error);
            }
        }
    };

    const fetchUserData = async () => {
        try {
            const data = await apiFetch(`http://localhost:8081/users/${id}`);
            setUser(data);
        } catch (error) {
            console.error("Ошибка при загрузке данных пользователя:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPhoto = async () => {
        try {
            const response = await fetch(`http://localhost:8081/users/${id}/photo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                setPhoto(URL.createObjectURL(blob));
            } else {
                console.error("Ошибка при загрузке фотографии пользователя:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при загрузке фотографии пользователя:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchUserPhoto();
    }, [id]);

    if (loading) {
        return (
            <div style={{ paddingTop: '60px' }}>
                <NavBar />
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ paddingTop: '60px' }}>
                <NavBar />
                <p>Пользователь не найден</p>
            </div>
        );
    }

    const genderDisplay = user.gender === 'MALE' ? 'Мужской' : user.gender === 'FEMALE' ? 'Женский' : 'Не указан';

    return (
        <div style={{ paddingTop: '50px' }}>
            <NavBar />
            <div className={styles.profilePage}>
                <div className={styles.profileBox}>
                    <h2 className={styles.headerText}>{user.firstName} {user.lastName}</h2>

                    <div className={styles.profilePhotoContainer}>
                        {photo ? (
                            <img src={photo} alt="Profile" className={styles.profilePhoto} />
                        ) : (
                            <p className={styles.noPhotoText}>Фото профиля отсутствует</p>
                        )}
                    </div>

                    {parseInt(id) === parseInt(currentUserId) && (
                        <div className={styles.uploadPhoto}>
                            <label htmlFor="uploadPhoto">Загрузить новое фото</label>
                            <input type="file" id="uploadPhoto" onChange={handlePhotoUpload} />
                            <button
                                className={styles.uploadButton}
                                onClick={() => document.getElementById("uploadPhoto").click()}
                            >
                                Выбрать файл
                            </button>
                        </div>
                    )}

                    <p>Город: {user.city || 'Не указано'}</p>
                    <p>Профессия: {user.profession ? user.profession.name : 'Не указана'}</p>
                    <p>Дата рождения: {user.dateOfBirth || 'Не указана'}</p>
                    <p>Пол: {genderDisplay}</p>
                </div>

                {/* Кнопки для просмотра и оценки Soft и Hard Skills */}
                {(parseInt(id) === parseInt(currentUserId) || roleType === 'ROLE_ADMIN') ? (
                    <div className={styles.rateButtons}>
                        <Link to={`/users/${id}/hard-skills/average-ratings`}>
                            <button>Просмотреть оценки Hard Skills</button>
                        </Link>
                        <Link to={`/users/${id}/soft-skills/average-ratings`}>
                            <button>Просмотреть оценки Soft Skills</button>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.rateButtons}>
                        <Link to={`/users/${id}/hard-skills/`}>
                            <button>Оценить Hard Skills</button>
                        </Link>
                        <Link to={`/soft-skills/${id}`}>
                            <button>Оценить Soft Skills</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
