import axios from 'axios';

const BASE_URL = "https://dummyjson.com";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type" : "Application/json"
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (credentials) => { 
        console.log("Sending login request with:", credentials);
        const response = await api.post('/auth/login', {
            username: credentials.username,
            password: credentials.password,
        });
        
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        console.log("Token saved:", token);
        const expiresIn = 60 * 100000;
        const timeLeft = Date.now() + expiresIn;
        localStorage.setItem("tokenExpiry", timeLeft);
        console.log("tokenExpiry", timeLeft);

        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};

export const productsApi = {
    getAll: () => api.get("/products"),
    getById: (id) => api.get(`/products/${id}`)
};