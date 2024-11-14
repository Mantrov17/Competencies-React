import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';
import styles from './AdminAllHardSkills.module.scss';

const AdminAllHardSkills = () => {
    const [professions, setProfessions] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [hardSkills, setHardSkills] = useState([]);
    const [allHardSkills, setAllHardSkills] = useState([]);
    const [newProfessionName, setNewProfessionName] = useState('');
    const [newSkillName, setNewSkillName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true); // Добавлено состояние загрузки

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProfessions();
                await fetchAllHardSkills();
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchProfessions = async () => {
        try {
            const data = await apiFetch("http://localhost:8081/professions/all");
            setProfessions(data);
        } catch (error) {
            console.error('Ошибка при загрузке профессий:', error);
            setErrorMessage('Не удалось загрузить список профессий.');
        }
    };

    const fetchAllHardSkills = async () => {
        try {
            const data = await apiFetch("http://localhost:8081/hard-skills/all");
            setAllHardSkills(data);
        } catch (error) {
            console.error('Ошибка при загрузке Hard Skills:', error);
        }
    };

    const fetchProfessionHardSkills = async (professionId) => {
        try {
            const data = await apiFetch(`http://localhost:8081/professions/${professionId}/hard-skills`);
            setHardSkills(data);
        } catch (error) {
            console.error('Ошибка при загрузке навыков профессии:', error);
        }
    };

    const handleProfessionSelect = (profession) => {
        setSelectedProfession(profession);
        fetchProfessionHardSkills(profession.id);
    };

    const handleAddProfession = async () => {
        if (!newProfessionName.trim()) {
            setErrorMessage('Название профессии не может быть пустым.');
            return;
        }
        try {
            const addedProfession = await apiFetch('http://localhost:8081/professions/add', {
                method: 'POST',
                body: JSON.stringify({ name: newProfessionName }),
            });
            setProfessions([...professions, addedProfession]);
            setNewProfessionName('');
            setSuccessMessage('Профессия успешно добавлена!');
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при добавлении профессии:', error);
            setErrorMessage('Не удалось добавить профессию.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleAddSkillToProfession = async (skillId) => {
        try {
            await apiFetch(`http://localhost:8081/professions/${selectedProfession.id}/add-existing-hard-skill/${skillId}`, {
                method: 'POST',
            });
            fetchProfessionHardSkills(selectedProfession.id);
            setSuccessMessage('Навык успешно добавлен к профессии!');
        } catch (error) {
            console.error('Ошибка при добавлении навыка к профессии:', error);
            setErrorMessage('Не удалось добавить навык к профессии.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleAddNewSkillToProfession = async () => {
        if (!newSkillName.trim()) {
            setErrorMessage('Название Hard Skill не может быть пустым.');
            return;
        }
        try {
            const addedSkill = await apiFetch(`http://localhost:8081/professions/${selectedProfession.id}/add-new-hard-skill`, {
                method: 'POST',
                body: JSON.stringify({ name: newSkillName }),
            });
            setHardSkills([...hardSkills, addedSkill]);
            setNewSkillName('');
            setSuccessMessage('Hard Skill успешно добавлен в профессию!');
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при добавлении Hard Skill в профессию:', error);
            setErrorMessage('Не удалось добавить Hard Skill в профессию.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleRemoveSkillFromProfession = async (skillId) => {
        try {
            await apiFetch(`http://localhost:8081/professions/${selectedProfession.id}/remove-hard-skills/${skillId}`, {
                method: 'DELETE',
            });
            fetchProfessionHardSkills(selectedProfession.id);
            setSuccessMessage('Навык успешно удален из профессии!');
        } catch (error) {
            console.error('Ошибка при удалении навыка из профессии:', error);
            setErrorMessage('Не удалось удалить навык из профессии.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };



    const handleDeleteProfession = async (professionId) => {
        try {
            await apiFetch(`http://localhost:8081/professions/${professionId}/delete`, {
                method: 'DELETE',
            });
            setProfessions(professions.filter(prof => prof.id !== professionId));
            setSelectedProfession(null);
            setHardSkills([]);
            setSuccessMessage('Профессия успешно удалена!');
        } catch (error) {
            console.error('Ошибка при удалении профессии:', error);
            setErrorMessage('Не удалось удалить профессию.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };
    if (loading) {
        return (
            <div  style={{ paddingTop: '60px' }}>
                <NavBar />
                <p>Загрузка данных...</p>
            </div>
        );
    }
    return (
        <div>
            <NavBar/>
            <h2 className={styles.headerText}>Управление профессиями и навыками</h2>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.inputContainer}>
                <h3>Добавить новую профессию</h3>
                <input
                    type="text"
                    value={newProfessionName}
                    onChange={(e) => setNewProfessionName(e.target.value)}
                    placeholder="Название профессии"
                    className={styles.inputField}
                />
                <button onClick={handleAddProfession} className={styles.addButton}>
                    Добавить
                </button>
            </div>

            <div className={styles.professionsList}>
                <h3>Список профессий</h3>
                <ul>
                    {professions.map(prof => (
                        <li key={prof.id} className={styles.professionItem}>
                            <button onClick={() => handleProfessionSelect(prof)} className={styles.professionButton}>
                                {prof.name}
                            </button>
                            <button onClick={() => handleDeleteProfession(prof.id)} className={styles.deleteButton}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedProfession && (
                <div className={styles.professionDetails}>
                    <h3>Навыки для профессии: {selectedProfession.name}</h3>

                    <div className={styles.inputContainer}>
                        <h4>Добавить новый Hard скилл в профессию</h4>
                        <input
                            type="text"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="Название Hard скилла"
                            className={styles.inputField}
                        />
                        <button onClick={handleAddNewSkillToProfession} className={styles.addButton}>
                            Добавить Hard Скилл
                        </button>
                    </div>

                    <div className={styles.skillsSection}>
                        <div className={styles.professionSkills}>
                            <h4>Навыки профессии</h4>
                            <ul>
                                {hardSkills.map(skill => (
                                    <li key={skill.id}>
                                        {skill.name}
                                        <button onClick={() => handleRemoveSkillFromProfession(skill.id)}>Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.allSkills}>
                            <h4>Все навыки</h4>
                            <ul>
                                {allHardSkills.map(skill => (
                                    <li key={skill.id}>
                                        {skill.name}
                                        <button onClick={() => handleAddSkillToProfession(skill.id)}>Добавить</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAllHardSkills;
