import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar/NavBar";
import { apiFetch } from '../../utils/api';
import styles from './AdminSoftSkillsManagement.module.scss';

const AdminSoftSkillsManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSkillName, setNewSkillName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await apiFetch("http://localhost:8081/soft-skills/categories-with-skills");
            setCategories(data);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
            setErrorMessage('Не удалось загрузить список категорий.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            setErrorMessage('Название категории не может быть пустым.');
            return;
        }

        try {
            const addedCategory = await apiFetch('http://localhost:8081/soft-skills/category/add', {
                method: 'POST',
                body: JSON.stringify({name: newCategoryName}),
            });

            setCategories([...categories, {...addedCategory, softSkills: []}]);
            setNewCategoryName('');
            setSuccessMessage('Категория успешно добавлена!');
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
            setErrorMessage('Не удалось добавить категорию.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await apiFetch(`http://localhost:8081/soft-skills/category/${categoryId}/delete`, {
                method: 'DELETE',
            });

            setCategories(categories.filter(cat => cat.id !== categoryId));
            if (selectedCategory && selectedCategory.id === categoryId) {
                setSelectedCategory(null);
            }
            setSuccessMessage('Категория успешно удалена!');
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            setErrorMessage('Не удалось удалить категорию.');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) {
            setErrorMessage('Название навыка не может быть пустым.');
            return;
        }

        try {
            const addedSkill = await apiFetch(`http://localhost:8081/soft-skills/category/${selectedCategory.id}/add-soft-skill`, {
                method: 'POST',
                body: JSON.stringify({name: newSkillName}),
            });

            setSelectedCategory({
                ...selectedCategory,
                softSkills: [...selectedCategory.softSkills, addedSkill],
            });

            setCategories(categories.map(cat => cat.id === selectedCategory.id ? selectedCategory : cat));

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

    const handleDeleteSkill = async (skillId) => {
        try {
            await apiFetch(`http://localhost:8081/soft-skills/${skillId}/delete`, {
                method: 'DELETE',
            });

            setSelectedCategory({
                ...selectedCategory,
                softSkills: selectedCategory.softSkills.filter(skill => skill.id !== skillId),
            });

            setCategories(categories.map(cat => cat.id === selectedCategory.id ? selectedCategory : cat));

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
            <div  style={{ paddingTop: '60px' }}>
                <NavBar/>
                <p>Загрузка данных...</p>
            </div>
        );
    }
    return (
        <div>
            <NavBar/>
            <h2 className={styles.headerText}>Управление Soft скиллами и категориями</h2>

            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.inputContainer}>
                <h3>Добавить новую категорию</h3>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Название категории"
                    className={styles.inputField}
                />
                <button onClick={handleAddCategory} className={styles.addButton}>
                    Добавить
                </button>
            </div>

            <div className={styles.categoriesList}>
                <h3>Список категорий</h3>
                <ul>
                    {categories.map(cat => (
                        <li key={cat.id} className={styles.categoryItem}>
                            <span onClick={() => setSelectedCategory(cat)}>{cat.name}</span>
                            <button className={styles.deleteButton} onClick={() => handleDeleteCategory(cat.id)}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedCategory && (
                <div className={styles.categoryDetails}>
                    <h3>Навыки в категории: {selectedCategory.name}</h3>
                    <div className={styles.inputContainer}>
                        <h4>Добавить новый навык</h4>
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
                    <ul>
                        {selectedCategory.softSkills.map(skill => (
                            <li key={skill.id} className={styles.skillItem}>
                                <span>{skill.name}</span>
                                <button className={styles.deleteButton} onClick={() => handleDeleteSkill(skill.id)}>
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminSoftSkillsManagement;
