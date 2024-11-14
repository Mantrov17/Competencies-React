import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';
import styles from './AdminHardSkillsManagement.module.scss';

const AdminHardSkillsManagement = () => {
    const [hardSkills, setHardSkills] = useState([]);
    const [newSkillName, setNewSkillName] = useState('');
    const [editSkillId, setEditSkillId] = useState(null);
    const [editSkillName, setEditSkillName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHardSkills();
    }, []);

    const fetchHardSkills = async () => {
        try {
            const data = await apiFetch("http://localhost:8081/hard-skills/all");
            setHardSkills(data);
        } catch (error) {
            console.error('Ошибка при загрузке Hard Skills:', error);
            setErrorMessage('Не удалось загрузить список Hard Skills.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) {
            setErrorMessage('Название навыка не может быть пустым.');
            return;
        }

        try {
            const addedSkill = await apiFetch('http://localhost:8081/hard-skills/add', {
                method: 'POST',
                body: JSON.stringify({ name: newSkillName }),
            });

            setHardSkills([...hardSkills, addedSkill]);
            setNewSkillName('');
            setSuccessMessage('Навык успешно добавлен!');
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при добавлении навыка:', error);
            setErrorMessage('Не удалось добавить навык.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleEditSkill = (skill) => {
        setEditSkillId(skill.id);
        setEditSkillName(skill.name);
    };

    const handleUpdateSkill = async () => {
        try {
            await apiFetch(`http://localhost:8081/hard-skills/${editSkillId}/update`, {
                method: 'PUT',
                body: JSON.stringify({ name: editSkillName }),
            });

            setHardSkills(hardSkills.map(skill => skill.id === editSkillId ? { ...skill, name: editSkillName } : skill));
            setEditSkillId(null);
            setEditSkillName('');
            setSuccessMessage('Навык успешно обновлен!');
        } catch (error) {
            console.error('Ошибка при обновлении навыка:', error);
            setErrorMessage('Не удалось обновить навык.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await apiFetch(`http://localhost:8081/hard-skills/${skillId}/delete`, {
                method: 'DELETE',
            });

            setHardSkills(hardSkills.filter(skill => skill.id !== skillId));
            setSuccessMessage('Навык успешно удален!');
        } catch (error) {
            console.error('Ошибка при удалении навыка:', error);
            setErrorMessage('Не удалось удалить навык.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '60px' }}>
                <NavBar />
                <p>Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <h2 className={styles.headerText}>Управление Hard скиллами</h2>

            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.inputContainer}>
                <h3>Добавить новый навык</h3>
                <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Название навыка"
                    className={styles.inputField}
                />
                <button onClick={handleAddSkill} className={styles.addButton}>
                    Добавить
                </button>
            </div>

            <div className={styles.skillsList}>
                <h3>Список Hard Скиллов</h3>
                <ul>
                    {hardSkills.map(skill => (
                        <li key={skill.id} className={styles.skillItem}>
                            {editSkillId === skill.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editSkillName}
                                        onChange={(e) => setEditSkillName(e.target.value)}
                                        className={styles.inputField}
                                    />
                                    <button onClick={handleUpdateSkill} className={styles.editButton}>Сохранить</button>
                                    <button onClick={() => setEditSkillId(null)}
                                            className={styles.deleteButton}>Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{skill.name}</span>
                                    <button onClick={() => handleEditSkill(skill)}
                                            className={styles.editButton}>Редактировать
                                    </button>
                                    <button onClick={() => handleDeleteSkill(skill.id)}
                                            className={styles.deleteButton}>Удалить
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default AdminHardSkillsManagement;
