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
    const [professions, setProfessions] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [isEditingProfession, setIsEditingProfession] = useState(false); // Состояние для управления режимом редактирования
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
            setSelectedProfession(data.profession?.id || null);
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

    const fetchProfessions = async () => {
        try {
            const data = await apiFetch('http://localhost:8081/professions/all');
            setProfessions(data);
        } catch (error) {
            console.error("Ошибка при загрузке списка профессий:", error);
        }
    };

    const handleProfessionUpdate = async () => {
        if (selectedProfession) {
            try {
                await apiFetch(`http://localhost:8081/users/${id}/profession/${selectedProfession}/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchUserData(); // Обновляем данные пользователя после изменения профессии
                setIsEditingProfession(false); // Закрываем режим редактирования после сохранения
            } catch (error) {
                console.error("Ошибка при обновлении профессии пользователя:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchUserPhoto();
        fetchProfessions();
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

                    {/* Блок для отображения или изменения профессии */}
                    <div className={styles.professionContainer}>
                        <p>Профессия: {user.profession ? user.profession.name : 'Не указана'}</p>
                        {roleType === 'ROLE_ADMIN' && !isEditingProfession && (
                            <button
                                onClick={() => setIsEditingProfession(true)}
                                className={styles.editButton}
                            >
                                Изменить
                            </button>
                        )}
                        {isEditingProfession && (
                            <div className={styles.professionSelection}>
                                <select
                                    id="professionSelect"
                                    value={selectedProfession || ""}
                                    onChange={(e) => setSelectedProfession(e.target.value)}
                                >
                                    <option value="">Не указана</option>
                                    {professions.map((profession) => (
                                        <option key={profession.id} value={profession.id}>
                                            {profession.name}
                                        </option>
                                    ))}
                                </select>
                                <div>
                                    <button onClick={handleProfessionUpdate}>Сохранить</button>
                                    <button onClick={() => setIsEditingProfession(false)}>Отмена</button>
                                </div>

                            </div>
                        )}
                    </div>

                    <p>Дата рождения: {user.dateOfBirth || 'Не указана'}</p>
                    <p>Пол: {genderDisplay}</p>
                </div>

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
