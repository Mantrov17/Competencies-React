// Функция для получения заголовка Authorization
export const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken'); // Или используйте Redux для получения токена
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Централизованная функция для выполнения fetch-запросов
export const apiFetch = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeader(), // Добавляем заголовок Authorization
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
};