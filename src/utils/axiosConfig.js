import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log(
                'API Request:',
                config.method?.toUpperCase(),
                config.url
            );
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        } else if (error.response) {
            console.error(
                'API Error:',
                error.response.status,
                error.response.data
            );

            if (error.response.status === 401) {
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
