import React, { useEffect, useState } from 'react';
import styles from './AllHardSkills.module.scss';
import NavBar from "../NavBar/NavBar";
import { Link } from "react-router-dom";
import { apiFetch } from '../../utils/api';

const AllHardSkills = () => {
    const [hardSkills, setHardSkills] = useState([]);

    useEffect(() => {
        const fetchHardSkillsData = async () => {
            try {
                const data = await apiFetch('http://localhost:8080/hard-skills/all');
                setHardSkills(data);
            } catch (error) {
                console.error("Error loading hard skills data:", error);
            }
        };

        fetchHardSkillsData();
    }, []);

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Все доступные Hard скиллы</h2>
            <ul className={styles.allSkillsList}>
                {hardSkills.map(item => (
                    <li key={item.id}>
                        <Link to={`/category/${item.category}`}>
                            <div>{item.category}</div>
                        </Link>
                        <ul className={styles.concreteSkillsList}>
                            {item.skills.map(skill => (
                                <li key={skill.id}>
                                    <span>{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllHardSkills;
