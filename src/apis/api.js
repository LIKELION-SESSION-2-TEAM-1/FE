const API_BASE_URL = "https://port-0-tokplan-mild533144fe3281.sel3.cloudtype.app/";

const buildUrl = (path = "") => {
    if (!path) return API_BASE_URL;
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}/${normalizedPath}`;
};

/**
 * 공통 fetch 래퍼
 * - JSON 요청/응답을 기본으로 처리
 * - 비정상 응답 시 예외를 던져 상위에서 처리하도록 함
 */
export const request = async (path, { method = "GET", headers = {}, body } = {}) => {
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

    const res = await fetch(buildUrl(path), init);
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
