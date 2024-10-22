import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './HardSkillNoRate.scss';
import NavBar from "../NavBar/NavBar";

const HardSkillNoRate = () => {
    const { category } = useParams();
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await fetch(`http://localhost:3002/hardSkills`);
                const data = await response.json();
                const skillsForCategory = data.find(item => item.category === category);
                if (skillsForCategory) {
                    setSkills(skillsForCategory.skills);
                }
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
                    <li key={skill.name}>
                        <div>{skill.name}</div>
                        <ul className={styles.concreteSkillsList}>
                            {skill.indicators.map(indicator => (
                                <li key={indicator}>
                                    <span>{indicator}</span>
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
