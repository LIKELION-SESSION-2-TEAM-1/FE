import axios from 'axios';

const api = axios.create({
    baseURL: 'https://port-0-bemaster-mild533144fe3281.sel3.cloudtype.app',
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
        // 토큰은 헤더에 있으므로 전체 response를 반환하거나 헤더에서 추출
        return response;
    } catch (error) {
        throw error;
    }
};

export default api;
