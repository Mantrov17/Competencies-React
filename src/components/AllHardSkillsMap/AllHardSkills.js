import React, { useEffect, useState } from 'react';
import styles from './AllHardSkills.module.scss';
import NavBar from "../NavBar/NavBar";
import { Link } from "react-router-dom";

const AllHardSkills = () => {
    const [hardSkills, setHardSkills] = useState([]);

    useEffect(() => {
        const fetchHardSkillsData = async () => {
            try {
                const response = await fetch(`http://localhost:3002/hardSkills`);
                const data = await response.json();
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
                    <li key={item.category}>
                        <Link to={`/category/${item.category}`}>
                            <div>{item.category}</div>
                        </Link>
                        <ul className={styles.concreteSkillsList}>
                            {item.skills.map(skill => (
                                <li key={skill.name}>
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
