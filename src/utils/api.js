// utils/api.js

export const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (url, options = {}) => {
    const authHeader = getAuthHeader();
    const isFormData = options.body instanceof FormData; // Ensure this is defined before use
    options.headers = {
        ...options.headers,
        ...authHeader,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),  // Content-Type не добавляется для FormData
    };

    console.log('Отправка запроса на', url);
    console.log('Заголовки запроса:', options.headers);

    const response = await fetch(url, options);

    if (!response.ok) {
        if (response.status === 401) {
            console.error("Ошибка 401: Не авторизован. Перенаправление на страницу входа.");
            window.location.href = "/";
        } else if (response.status === 403) {
            console.error("Ошибка 403: Доступ запрещен.");
            alert("У вас нет прав для выполнения этого действия.");
        }
        throw new Error(`HTTP Error: ${response.status}`);
    }

    // Проверяем, есть ли содержимое в ответе
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    if (response.status === 204 || !contentType || contentLength === '0') {
        // Ответ без содержимого
        return null;
    }

    if (isFormData) {
        return response.blob();
    } else if (contentType.includes('application/json')) {
        return response.json();
    } else {
        return null;
    }
};

