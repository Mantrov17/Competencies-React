import React, { useEffect, useState } from 'react';
import styles from './AllHardSkills.module.scss';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';

const AllHardSkills = () => {
    const [professions, setProfessions] = useState([]);
    const [loading, setLoading] = useState(true); // Добавлено состояние загрузки

    useEffect(() => {
        const fetchData = async () => {
            try {
                const professionsData = await apiFetch('http://localhost:8081/professions/all');
                const professionsWithSkills = [];

                for (const profession of professionsData) {
                    try {
                        const hardSkills = await apiFetch(`http://localhost:8081/professions/${profession.id}/hard-skills`);
                        professionsWithSkills.push({
                            ...profession,
                            hardSkills: hardSkills || [],
                        });
                    } catch (error) {
                        console.error(`Ошибка при загрузке навыков для профессии ${profession.name}:`, error);
                    }
                }

                setProfessions(professionsWithSkills);
            } catch (error) {
                console.error("Ошибка при загрузке данных профессий:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <h2 className={styles.headerText}>Все доступные Hard скиллы по профессиям</h2>
            <ul className={styles.allSkillsList}>
                {professions.length > 0 ? (
                    professions.map(profession => (
                        <li key={profession.id}>
                            <div className={styles.professionName}>{profession.name}</div>
                            {profession.hardSkills && profession.hardSkills.length > 0 ? (
                                <ul className={styles.concreteSkillsList}>
                                    {profession.hardSkills.map(skill => (
                                        <li key={skill.id}>
                                            <span>{skill.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Нет навыков для этой профессии</p>
                            )}
                        </li>
                    ))
                ) : (
                    <p>Нет доступных данных о профессиях и навыках</p>
                )}
            </ul>
        </div>
    );
};

export default AllHardSkills;
