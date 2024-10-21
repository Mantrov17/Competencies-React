import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SoftSkillsMap.module.scss';
import NavBar from "../NavBar/NavBar";

const SoftSkillsMap = () => {
    const { id } = useParams();
    const [softSkills, setSoftSkills] = useState([]);
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
        const fetchSoftSkillsData = async () => {
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:3003/softSkills`);
                const data = await response.json();
                const skillsForCategory = data.find(item => item.category === "Социальные навыки");
                if (skillsForCategory) {
                    setSoftSkills(skillsForCategory.skills);
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
                console.error("Error loading soft skills data:", error);
            }
        };

        fetchSoftSkillsData();
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
            <h2 className={styles.headerText}>Оцените Soft скиллы {user.name}</h2>
            {isSaving && <p>Saving changes...</p>}
            <ul className={styles.allSkillsList}>
                {softSkills.map(skill => (
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
            <button className={styles.submitButton} onClick={handleSubmit}>Отправить</button>
        </div>
    );
};

export default SoftSkillsMap;
