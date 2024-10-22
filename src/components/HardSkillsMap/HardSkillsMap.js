import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './HardSkillsMap.module.scss';
import NavBar from "../NavBar/NavBar";

const HardSkillsMap = () => {
    const { id } = useParams();
    const [hardSkills, setHardSkills] = useState([]);
    const [user, setUser] = useState(null);
    const [ratings, setRatings] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = Number(id);
                const response = await fetch(`http://localhost:3001/profile-info?id=${userId}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setUser(data[0]);
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        const fetchHardSkillsData = async () => {
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:3002/hardSkills`);
                const data = await response.json();
                const skillsForCategory = data.find(item => item.category === user.category);
                if (skillsForCategory) {
                    setHardSkills(skillsForCategory.skills);
                    const initialRatings = {};
                    skillsForCategory.skills.forEach(skill => {
                        skill.indicators.forEach(indicator => {
                            initialRatings[skill.name] = {
                                ...initialRatings[skill.name],
                                [indicator]: "no data"
                            };
                        });
                    });
                    setRatings(initialRatings);
                }
            } catch (error) {
                console.error("Error loading hard skills data:", error);
            }
        };

        fetchHardSkillsData();
    }, [user]);

    const handleRatingChange = (skillName, indicator, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [skillName]: {
                ...prevRatings[skillName],
                [indicator]: rating
            }
        }));
    };

    const handleSubmit = () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log("Ratings submitted:", ratings);
            setIsSaving(false);
        }, 1000);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Оцените Hard скиллы {user.name} в сфере "{user.category}"</h2>
            {isSaving && <p>Saving changes...</p>}
            <ul className={styles.allSkillsList}>
                {hardSkills.map(skill => (
                    <li key={skill.name}>
                        <div>{skill.name}</div>
                        <ul className={styles.concreteSkillsList}>
                            {skill.indicators.map(indicator => (
                                <li key={indicator}>
                                    <span>{indicator}:</span>

                                    <select
                                        value={ratings[skill.name]?.[indicator] || "no data"}
                                        onChange={(e) => handleRatingChange(skill.name, indicator, e.target.value)}
                                    >
                                        <option value="no data"></option>
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
