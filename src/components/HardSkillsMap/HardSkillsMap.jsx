import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './HardSkillsMap.module.scss';
import NavBar from '../NavBar/NavBar';
import { apiFetch } from '../../utils/api';
import { useSelector } from 'react-redux';

const HardSkillsMap = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [hardSkillsData, setHardSkillsData] = useState([]);
    const [ratings, setRatings] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true); // Добавлено состояние загрузки

    const currentUserId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiFetch(`http://localhost:8081/users/${id}`);
                setUser(userData);

                if (userData.profession && userData.profession.id) {
                    const hardSkills = await apiFetch(`http://localhost:8081/professions/${userData.profession.id}/hard-skills`);
                    setHardSkillsData(hardSkills);
                    initializeRatings(hardSkills);
                } else {
                    console.error("У пользователя не указана профессия.");
                    setHardSkillsData([]);
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя или его Hard Skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const initializeRatings = (skills) => {
        const initialRatings = {};
        skills.forEach(skill => {
            initialRatings[skill.id] = "no data";
        });
        setRatings(initialRatings);
    };

    const handleRatingChange = (hardSkillId, rating) => {
        setRatings(prevRatings => ({ ...prevRatings, [hardSkillId]: rating }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const ratingEntries = Object.entries(ratings).filter(([, rating]) => rating !== "no data");

            await Promise.all(
                ratingEntries.map(async ([hardSkillId, rating]) => {
                    try {
                        const response = await apiFetch(
                            `http://localhost:8081/users/${id}/hard-skills/${hardSkillId}/add/${rating}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (response.status === 409) {
                            console.warn(`Оценка для навыка ${hardSkillId} уже существует, обновляем...`);
                            await apiFetch(
                                `http://localhost:8081/users/${id}/hard-skills/${hardSkillId}/update/${rating}`,
                                {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );
                        }
                    } catch (error) {
                        console.error(`Ошибка при отправке оценки для навыка ${hardSkillId}:`, error);
                    }
                })
            );
            alert("Оценки успешно отправлены или обновлены");
        } catch (error) {
            console.error("Ошибка при отправке оценок:", error);
        } finally {
            setIsSaving(false);
        }
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
            <h2 className={styles.headerText}>
                Оцените Hard скиллы пользователя {user.firstName} {user.lastName}
            </h2>

            {user.profession && (
                <ul className={styles.allSkillsList}>
                    <li key={user.profession.id}>
                        <div className={styles.professionName}>{user.profession.name}</div>
                        {hardSkillsData.length > 0 ? (
                            <ul className={styles.concreteSkillsList}>
                                {hardSkillsData.map(skill => (
                                    <li key={skill.id}>
                                        <span>{skill.name}</span>
                                        <select
                                            value={ratings[skill.id] || "no data"}
                                            onChange={(e) => handleRatingChange(skill.id, e.target.value)}
                                        >
                                            <option value="no data">Нет</option>
                                            <option value="-1">-1</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Нет навыков для этой профессии</p>
                        )}
                    </li>
                </ul>
            )}

            {isSaving && <p>Сохранение изменений...</p>}

            <div className={styles.rateButtons}>
                <Link to={`/profile-info/${id}`}>
                    <button>Вернуться к профилю</button>
                </Link>
            </div>

            {hardSkillsData.length > 0 && (
                <button className={styles.submitButton} onClick={handleSubmit}>Отправить</button>
            )}
        </div>
    );
};

export default HardSkillsMap;
