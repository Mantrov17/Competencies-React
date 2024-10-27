import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SoftSkillsMap.module.scss';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';
import { useSelector } from 'react-redux';

const SoftSkillsMap = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [softSkills, setSoftSkills] = useState([]);  // Инициализация пустым массивом
    const [ratings, setRatings] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiFetch(`http://localhost:8080/users/${id}`);
                setUser(userData);
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя:", error);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        const fetchSoftSkillsData = async () => {
            try {
                const data = await apiFetch('http://localhost:8080/soft-skill/all');
                setSoftSkills(data || []); // Убедимся, что значение не будет undefined
                initializeRatings(data);
            } catch (error) {
                console.error("Ошибка при загрузке soft skills:", error);
            }
        };

        fetchSoftSkillsData();
    }, []);

    const initializeRatings = (skills) => {
        const initialRatings = {};
        (skills || []).forEach(skill => {
            initialRatings[skill.name] = {};
            (skill.indicators || []).forEach(indicator => {
                initialRatings[skill.name][indicator] = "no data";
            });
        });
        setRatings(initialRatings);
    };

    const handleRatingChange = (skillName, indicator, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [skillName]: {
                ...prevRatings[skillName],
                [indicator]: rating
            }
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await Promise.all(
                Object.entries(ratings).flatMap(([skillName, indicators]) =>
                    Object.entries(indicators).map(([indicator, rating]) =>
                        apiFetch('http://localhost:8080/soft-skill-rating/add', {
                            method: 'POST',
                            body: JSON.stringify({
                                skillName,
                                indicator,
                                rating,
                                ratedUserId: id,
                                raterUserId: currentUser.id,
                            }),
                        })
                    )
                )
            );
            alert("Оценки успешно отправлены");
        } catch (error) {
            console.error("Ошибка при отправке оценок:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div>Загрузка...</div>;

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Оцените Soft Skills {user.firstName} {user.lastName}</h2>
            {isSaving && <p>Сохранение изменений...</p>}

            <ul className={styles.allSkillsList}>
                {softSkills && softSkills.length > 0 ? (
                    softSkills.map(skill => (
                        <li key={skill.name}>
                            <div>{skill.name}</div>
                            <ul className={styles.concreteSkillsList}>
                                {(skill.indicators || []).map(indicator => (
                                    <li key={indicator}>
                                        <span>{indicator}:</span>
                                        <select
                                            value={ratings[skill.name]?.[indicator] || "no data"}
                                            onChange={(e) => handleRatingChange(skill.name, indicator, e.target.value)}
                                        >
                                            <option value="no data">Нет данных</option>
                                            <option value="-1">-1</option>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <p>Загрузка данных о навыках...</p>
                )}
            </ul>

            <div className={styles.rateButtons}>
                <Link to={`/profile-info/${id}`}>
                    <button>Вернуться к профилю</button>
                </Link>
            </div>
            <button className={styles.submitButton} onClick={handleSubmit}>Отправить</button>
        </div>
    );
};

export default SoftSkillsMap;
