import { request } from "./api";

const SEARCH_API_BASE_URL = "https://port-0-bemaster-mild533144fe3281.sel3.cloudtype.app";

/**
 * 여행지(스토어) 검색
 * @param {string} keyword - 검색어
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchStores = async (keyword) => {
    const term = typeof keyword === "string" ? keyword.trim() : "";
    if (!term) {
        throw new Error("검색어(keyword)를 입력해주세요.");
    }

    const path = `/api/stores/search?keyword=${encodeURIComponent(term)}`;
    const result = await request(path, { baseUrl: SEARCH_API_BASE_URL });

    const candidates = [
        result,
        result?.data,
        result?.stores,
        result?.content,
        result?.result,
        result?.data?.stores,
        result?.data?.content,
    ];
    const firstArray = candidates.find(Array.isArray);
    return firstArray || [];
};
