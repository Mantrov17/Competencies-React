// src/components/SoftSkillsMap/SoftSkillsMap.jsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SoftSkillsMap.module.scss';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';
import { useSelector } from 'react-redux';

const SoftSkillsMap = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [softSkills, setSoftSkills] = useState([]);
    const [ratings, setRatings] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentUserId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiFetch(`http://localhost:8081/users/${id}`);
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
                const data = await apiFetch('http://localhost:8081/soft-skills/categories-with-skills');
                setSoftSkills(data || []);
                initializeRatings(data);
            } catch (error) {
                console.error("Ошибка при загрузке soft skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSoftSkillsData();
    }, []);

    const initializeRatings = (categories) => {
        const initialRatings = {};
        categories.forEach(category => {
            category.softSkills.forEach(skill => {
                initialRatings[skill.id] = "no data";
            });
        });
        setRatings(initialRatings);
    };

    const handleRatingChange = (skillId, rating) => {
        setRatings(prevRatings => ({ ...prevRatings, [skillId]: rating }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const ratingsToSubmit = Object.entries(ratings)
                .filter(([, rating]) => rating !== "no data")
                .map(([skillId, rating]) => ({
                    softSkillId: parseInt(skillId),
                    rating: parseInt(rating),
                    ratedUserId: parseInt(id),
                    raterUserId: parseInt(currentUserId),
                }));

            await apiFetch('http://localhost:8081/soft-skill-rating/add-multiple', {
                method: 'POST',
                body: JSON.stringify({ ratings: ratingsToSubmit }),
            });

            alert("Оценки успешно отправлены");
        } catch (error) {
            console.error("Ошибка при отправке оценок:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '60px' }}>
                <NavBar />
                <p>Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>
                {user ? `Оцените Soft скиллы пользователя ${user.firstName} ${user.lastName}` : "Загрузка..."}
            </h2>
            {isSaving && <p>Сохранение изменений...</p>}
            <ul className={styles.allSkillsList}>
                {softSkills.map(category => (
                    <li key={category.id}>
                        <div>{category.name}</div>
                        <ul className={styles.concreteSkillsList}>
                            {category.softSkills.map(skill => (
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
                    </li>
                ))}
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
