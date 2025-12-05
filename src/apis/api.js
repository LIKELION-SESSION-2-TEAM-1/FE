import axios from 'axios';

// --- Axios Implementation for Login/Signup (Headers Access Required) ---
const api = axios.create({
    baseURL: 'https://port-0-bemaster-mild533144fe3281.sel3.cloudtype.app', // Keeping this as it was working/tested. If main uses tokplan, we might need to update this later.
    headers: {
        'Content-Type': 'application/json',
    },
});

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
        return response;
    } catch (error) {
        throw error;
    }
};
export default api;


// --- Fetch Implementation from Main (For other features) ---
const API_BASE_URL = "https://port-0-tokplan-mild533144fe3281.sel3.cloudtype.app/";

const buildUrl = (path = "", baseUrl = API_BASE_URL) => {
    if (!path) return baseUrl;
    const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}/${normalizedPath}`;
};

/**
 * 공통 fetch 래퍼
 * - JSON 요청/응답을 기본으로 처리
 * - 비정상 응답 시 예외를 던져 상위에서 처리하도록 함
 */
export const request = async (path, { method = "GET", headers = {}, body, baseUrl } = {}) => {
    const init = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (body !== undefined) {
        init.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const res = await fetch(buildUrl(path, baseUrl), init);
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return res.text();
};

export { API_BASE_URL };
