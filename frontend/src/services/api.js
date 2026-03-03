import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            const isStaff = window.location.pathname.startsWith('/staff');
            window.location.href = isStaff ? '/staff/login' : '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
