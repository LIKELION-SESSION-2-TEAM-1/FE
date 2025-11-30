import { request } from "./api";

/**
 * AI 키워드 분석 요청
 * @param {number|string} chatRoomId
 * @returns {Promise<{keywords: string[]}>}
 */
export const fetchAiKeywords = async (chatRoomId) => {
    if (chatRoomId === undefined || chatRoomId === null) {
        throw new Error("chatRoomId is required");
    }

    // API 명세상 POST /api/ai/keywords/{chatRoomId}
    const result = await request(`/api/ai/keywords/${chatRoomId}`, {
        method: "POST",
        body: { keywords: [] }, // 명세에 맞춰 빈 배열 전송
    });

    // 응답이 배열만 내려올 경우도 대비
    if (Array.isArray(result)) {
        return { keywords: result };
    }
    return {
        keywords: Array.isArray(result?.keywords) ? result.keywords : [],
    };
};
