import axios from 'axios';
import { getAccessToken } from '../utils/authToken';

// --- Base URL Configuration ---
export const MAIN_BASE_URL = "https://port-0-beeee-mjfnlzve18281716.sel3.cloudtype.app";
export const SEARCH_BASE_URL = "https://port-0-bemaster-mild533144fe3281.sel3.cloudtype.app";

// --- Axios Instance Creator to share interceptor logic ---
const createAxiosInstance = (baseUrl) => {
    const instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor to add the auth token
    instance.interceptors.request.use(
        (config) => {
            // Exclude token for login and signup endpoints if needed, 
            // though usually sending it doesn't hurt unless server complains.
            // We'll keep the check for safety if it's the main API.
            if (config.baseURL === MAIN_BASE_URL && (config.url.endsWith('/login') || config.url.endsWith('/signup'))) {
                return config;
            }

            const token = getAccessToken();
            if (token) config.headers['Authorization'] = token;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor (optional, for global error handling)
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Handle 401 token expiration here if needed in future
            return Promise.reject(error);
        }
    );

    return instance;
};

// --- API Instances ---
const api = createAxiosInstance(MAIN_BASE_URL); // Main User/Chat API
export const searchApi = createAxiosInstance(SEARCH_BASE_URL); // Search/AI API

// --- User/Auth API Methods ---
export const signup = async (username, password) => {
    try {
        const response = await api.post('/api/user/signup', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await api.post('/api/user/login', { username, password });
        return response; // Returns full response for status check
    } catch (error) {
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/api/user/profile');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/api/user/profile', profileData);
        return response.data;
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await api.delete('/api/user');
        return response.data;
    } catch (error) {
        console.error("Failed to delete account:", error);
        throw error;
    }
};

export default api;
