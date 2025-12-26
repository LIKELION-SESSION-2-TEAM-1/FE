import api from "./api";
import Aromanize from "aromanize";

/**
 * 여행지(스토어) 검색
 * @param {string} keyword - 검색어
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchStores = async (keyword) => {
    let term = typeof keyword === "string" ? keyword.trim() : "";
    if (!term) {
        throw new Error("검색어(keyword)를 입력해주세요.");
    }

    // [한글 깨짐 방지] 사용자의 요청대로 내부적으로 영문 변환(Romanization) 후 검색
    const romanizedTerm = Aromanize.romanize(term);
    if (romanizedTerm !== term) {
        console.log(`[Search] Converting Korean '${term}' to English '${romanizedTerm}'`);
        term = romanizedTerm;
    }

    // 유저가 Postman으로 확인한 결과, 검색 API도 Main 서버(beeee...)에 있음.
    // 따라서 기존 searchApi(bemaster...) 대신 api(beeee...)를 사용해야 함.
    const response = await api.get('/api/stores/search', {
        params: { keyword: term }
    });
    const data = response.data;

    // Common structure variations
    const candidates = [
        data,
        data?.data,
        data?.stores,
        data?.content,
        data?.result,
        data?.data?.stores,
        data?.data?.content,
    ];
    const firstArray = candidates.find(Array.isArray);
    return firstArray || [];
};

/**
 * 최근 검색어 조회
 */
export const getRecentSearches = async () => {
    const response = await api.get("/api/searches/recent");
    return response.data; // Usually returns list or object containing list
};

/**
 * 최근 검색어 추가
 * @param {string} keyword
 */
export const addRecentSearch = async (keyword) => {
    const response = await api.post("/api/searches/recent", { keyword });
    return response.data;
};

/**
 * 최근 검색어 개별 삭제
 * @param {number|string} recentSearchId
 */
export const deleteRecentSearch = async (recentSearchId) => {
    const response = await api.delete(`/api/searches/recent/${recentSearchId}`);
    return response.data;
};

/**
 * 최근 검색어 전체 삭제
 */
export const deleteAllRecentSearches = async () => {
    const response = await api.delete("/api/searches/recent");
    return response.data;
};

/**
 * 즐겨찾기 추가
 * @param {object} item - 검색 결과 아이템
 */
export const addFavorite = async (item) => {
    const response = await api.post("/api/favorites", item);
    return response.data;
};

/**
 * 즐겨찾기 목록 조회
 */
export const getFavorites = async () => {
    const response = await api.get("/api/favorites");
    return response.data;
};

/**
 * 즐겨찾기 삭제
 * @param {number|string} favoriteId
 */
export const deleteFavorite = async (favoriteId) => {
    const response = await api.delete(`/api/favorites/${favoriteId}`);
    return response.data;
};

/**
 * 주간 인기 여행지 랭킹 조회
 * @returns {Promise<Array>} 랭킹 데이터 배열
 */
export const getWeeklyRanking = async () => {
    // 유저 제보: 랭킹 API도 Main 서버(beeee...)에 있음
    const response = await api.get("/api/ranking/weekly");
    return response.data;
};
