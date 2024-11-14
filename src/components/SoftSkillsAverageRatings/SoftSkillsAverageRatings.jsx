import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import styles from './SoftSkillsAverageRatings.module.scss';
import NavBar from '../NavBar/NavBar';
import { apiFetch } from '../../utils/api';
import { useSelector } from 'react-redux';

const SoftSkillsAverageRatings = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [softSkillsData, setSoftSkillsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = useSelector((state) => state.auth.userId);
    const roleType = useSelector((state) => state.auth.roleType);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiFetch(`http://localhost:8081/users/${id}`);
                setUser(userData);

                const softSkillsWithRatings = await apiFetch(`http://localhost:8081/soft-skill-rating/user/${id}/soft-skills-with-ratings`);
                setSoftSkillsData(softSkillsWithRatings);
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя или его Soft Skills:", error);
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
                Средние оценки Soft скиллов пользователя {user.firstName} {user.lastName}
            </h2>

            {softSkillsData.length > 0 ? (
                <div className={styles.allSkillsList}>
                    {softSkillsData.map(category => (
                        <div key={category.id} className={styles.category}>
                            <div className={styles.categoryTitle}>{category.name}</div>
                            <ul className={styles.concreteSkillsList}>
                                {category.softSkills.map(skill => (
                                    <li key={skill.id} className={styles.skillItem}>
                                        <span>{skill.name}</span>
                                        <div className={styles.averageRatingCircle}>
                                            {skill.averageRating !== null ? Math.round(skill.averageRating) : 'Нет'}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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

export default SoftSkillsAverageRatings;
