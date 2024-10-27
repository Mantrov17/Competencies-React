import styles from './NavBar.module.scss';
import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from 'react-redux';

const NavBar = () => {
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id; // Или получить из состояния Redux
    return (
        <div className={styles.navBar}>
            <Link to={`/workers-list-page`} className={styles.usersRateButton}>Перейти к оценке сотрудников</Link>
            <Link to={`/all-hard-skills`} className={styles.usersRateButton}>Список всех Hard скиллов</Link>
            <Link to={`/profile-info/${userId}`} className={styles.myProfileButton}>
                <img src="https://avatars.mds.yandex.net/i?id=72b88b25a6fea66a60da62b7b3460745e6557405-10477521-images-thumbs&n=13" alt="Профиль"></img>
            </Link>
        </div>
    )
}

export default NavBar;
