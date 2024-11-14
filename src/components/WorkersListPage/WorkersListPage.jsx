import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import NavBar from "../NavBar/NavBar";
import styles from './WorkersListPage.module.scss';

const WorkersListPage = () => {
    const [profiles, setProfiles] = useState([]);
    const { user, accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate('/');
            return;
        }

        const fetchProfiles = async () => {
            try {
                const data = await apiFetch('http://localhost:8081/users/all');
                setProfiles(data);
            } catch (error) {
                console.error('Ошибка при загрузке профилей:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [accessToken, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{paddingTop: '60px'}}>
                <NavBar/>
                <p>Загрузка списка сотрудников...</p>
            </div>
        );
    }

    return (
        <div>
            <NavBar/>
            <h2 className={styles.headerText}>Список работников</h2>
            {user && (
                <div>
                    <p>Вы вошли как: {user.firstName} {user.lastName}</p>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
            <ul className={styles.profilesList}>
                {profiles.map(profile => (
                    <Link to={`/profile-info/${profile.id}`}>
                        <li key={profile.id}>
                            {profile.firstName} {profile.lastName}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default WorkersListPage;
