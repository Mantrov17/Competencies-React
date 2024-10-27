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

    // Получение идентификатора текущего пользователя из Redux store
    const currentUser = useSelector((state) => state.auth.user);

    // Загрузка данных пользователя по ID
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

    // Загрузка списка hard skills, привязанных к пользователю
    useEffect(() => {
        const fetchHardSkillsData = async () => {
            try {
                const data = await apiFetch(`http://localhost:8080/users/${id}/hard-skills/user-profession`);
                setHardSkillsData(data.commonHardSkills);
                initializeRatings(data.commonHardSkills);
            } catch (error) {
                console.error("Ошибка при загрузке hard skills:", error);
            }
        };

        fetchHardSkillsData();
    }, [id]);

    // Инициализация оценок "Нет данных" для каждого hard skill
    const initializeRatings = (skills) => {
        const initialRatings = {};
        skills.forEach(skill => {
            initialRatings[skill.id] = "no data";
        });
        setRatings(initialRatings);
    };

    // Обработка изменений оценки для конкретного навыка
    const handleRatingChange = (skillId, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [skillId]: rating
        }));
    };

    // Отправка оценок на сервер
    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await Promise.all(
                Object.entries(ratings).map(([skillId, rating]) =>
                    apiFetch('http://localhost:8080/hard-skill-rating/add', {
                        method: 'POST',
                        body: JSON.stringify({
                            skillId,
                            rating,
                            ratedUserId: id,
                            raterUserId: currentUser.id,
                        }),
                    })
                )
            );
            alert("Оценки успешно отправлены");
        } catch (error) {
            console.error("Ошибка при отправке оценок:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div>Загрузка данных...</div>;

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Оцените Hard Skills {user.firstName} {user.lastName}</h2>
            {isSaving && <p>Сохранение изменений...</p>}
            <ul className={styles.allSkillsList}>
                {hardSkillsData.map(skill => (
                    <li key={skill.id}>
                        <div>{skill.name}</div>
                        <select
                            value={ratings[skill.id] || "no data"}
                            onChange={(e) => handleRatingChange(skill.id, e.target.value)}
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
            <div className={styles.rateButtons}>
                <Link to={`/profile-info/${id}`}>
                    <button>Вернуться к профилю</button>
                </Link>
            </div>
            <button className={styles.submitButton} onClick={handleSubmit}>Отправить</button>
        </div>
    );
};

export default HardSkillsMap;
