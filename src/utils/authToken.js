import useAuthStore from '../stores/useAuthStore';

const AUTH_STORAGE_KEY = 'auth-storage';
const ACCESS_TOKEN_KEY = 'accessToken';

const normalizeBearer = (token) => {
    if (!token) return null;
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

const readPersistedAuthToken = () => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        // zustand persist default shape: { state: {...}, version: number }
        const token = parsed?.state?.token ?? null;
        return token || null;
    } catch {
        return null;
    }
};

export const getAccessToken = () => {
    const direct = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (direct) return normalizeBearer(direct);

    // Try in-memory store first (might already be hydrated)
    const storeToken = useAuthStore.getState?.().token;
    if (storeToken) {
        const normalized = normalizeBearer(storeToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, normalized);
        return normalized;
    }

    // Fallback: read persisted zustand storage directly (avoids hydration timing issues)
    const persisted = readPersistedAuthToken();
    if (persisted) {
        const normalized = normalizeBearer(persisted);
        localStorage.setItem(ACCESS_TOKEN_KEY, normalized);
        return normalized;
    }

    return null;
};

export const setAccessToken = (token, username = 'Social User') => {
    const normalized = normalizeBearer(token);
    if (!normalized) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, normalized);
    useAuthStore.getState().login(normalized, username);
};

export const clearAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    useAuthStore.getState().logout();
};
