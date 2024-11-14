import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import styles from './HardSkillsAverageRatings.module.scss';
import NavBar from '../NavBar/NavBar';
import { apiFetch } from '../../utils/api';
import { useSelector } from 'react-redux';

const HardSkillsAverageRatings = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [hardSkillsData, setHardSkillsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = useSelector((state) => state.auth.userId);
    const roleType = useSelector((state) => state.auth.roleType);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiFetch(`http://localhost:8081/users/${id}`);
                setUser(userData);

                const hardSkillsWithRatings = await apiFetch(`http://localhost:8081/users/${id}/hard-skills/`);
                setHardSkillsData(hardSkillsWithRatings);
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя или его Hard Skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    if (parseInt(currentUserId) !== parseInt(id) && roleType !== 'ROLE_ADMIN') {
        return <Navigate to="/unauthorized" replace />;
    }

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
                Средние оценки Hard скиллов пользователя {user.firstName} {user.lastName}
            </h2>

            {hardSkillsData.length > 0 ? (
                <div className={styles.allSkillsList}>
                    <div className={styles.category}>
                        <div className={styles.categoryTitle}>
                            {user.profession ? user.profession.name : 'Профессия не указана'}
                        </div>
                        <ul className={styles.concreteSkillsList}>
                            {hardSkillsData.map(skill => (
                                <li key={skill.hardSkill.id} className={styles.skillItem}>
                                    <span>{skill.hardSkill.name}</span>
                                    <div className={styles.averageRatingCircle}>
                                        {skill.rating !== null ? Math.round(skill.rating) : 'Нет оценок'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Нет данных о навыках или оценках</p>
            )}

            <div className={styles.rateButtons}>
                <Link to={`/profile-info/${id}`}>
                    <button>Вернуться к профилю</button>
                </Link>
            </div>
        </div>
    );
};

export default HardSkillsAverageRatings;
