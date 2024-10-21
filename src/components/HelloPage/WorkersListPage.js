import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from "./WorkersListPage.module.scss";

const WorkersListPage = () => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:3001/profile-info');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке профилей');
                }
                const data = await response.json();
                setProfiles(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div>
            <NavBar />
            <h1 className={styles.headerText}>Выберите сотрудника для оценки</h1>
            <ul className={styles.profilesList}>
                {profiles.map(profile => (
                    <li className={styles.profile} key={profile.id}>
                        <Link to={`/profile-info/${profile.id}`}>{profile.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkersListPage;
