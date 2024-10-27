import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './HardSkillNoRate.scss';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';

const HardSkillNoRate = () => {
    const { category } = useParams();
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const data = await apiFetch(`http://localhost:8080/hard-skills/category/${category}`);
                setSkills(data);
            } catch (error) {
                console.error("Error loading skills data:", error);
            }
        };

        fetchSkillsData();
    }, [category]);

    if (!skills.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Все индикаторы для категории "{category}"</h2>
            <ul className={styles.allSkillsList}>
                {skills.map(skill => (
                    <li key={skill.id}>
                        <div>{skill.name}</div>
                        <ul className={styles.concreteSkillsList}>
                            {skill.indicators.map(indicator => (
                                <li key={indicator.id}>
                                    <span>{indicator.name}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HardSkillNoRate;
