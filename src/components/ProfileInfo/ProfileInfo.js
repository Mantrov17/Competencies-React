import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from './ProfileInfo.module.scss';

const ProfileInfo = () => {
    const { id } = useParams();
    const [user, setUser] = React.useState(null);

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
                console.error("Error loading data:", error);
            }
        };

        fetchUserData();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profilePage}>
            <NavBar />
            <div className={styles.profileBox}>
                <h2 className={styles.headerText}>{user.name}</h2>
                <p>Возраст: {user.age}</p>
                <p>Место работы: {user.city}</p>
                <p>Специальность: {user.category}</p>
                <div className={styles.rating}>
                    <div>
                        <p>Средняя оценка Hard Скиллов: </p>
                        <p className={styles.ratingNumber}>{user.averageHardSkill}</p>
                    </div>
                    <div>
                        <p>Средняя оценка Soft Скиллов: </p>
                        <p className={styles.ratingNumber}>{user.averageSoftSkill}</p>
                    </div>
                </div>
            </div>
            <div className={styles.rateButtons}>
                <Link to={`/hard-skills/${id}`}>
                    <button>Оценить Hard Скиллы</button>
                </Link>
                <Link to={`/soft-skills/${id}`}>
                    <button>Оценить Soft Скиллы</button>
                </Link>
            </div>
        </div>
    );
};

export default ProfileInfo;
