import api, { searchApi } from "./api";

/**
 * AI 키워드 분석 요청
 */
export const fetchAiKeywords = async (chatRoomId) => {
    if (chatRoomId === undefined || chatRoomId === null) {
        throw new Error("chatRoomId is required");
    }

    const response = await searchApi.post(`/api/ai/keywords/${chatRoomId}`, { keywords: [] });
    let result = response.data;

    // [방어 로직] 응답이 문자열인 경우 파싱 시도 (Axios may parse it, but if it's double string encoded)
    if (typeof result === "string") {
        try {
            result = JSON.parse(result);
        } catch (e) {
            console.error("Keywords Parse Error:", e);
            result = {};
        }
    }

    // 응답이 바로 배열인 경우 처리
    if (Array.isArray(result)) {
        return { keywords: result };
    }

    // 객체 안의 keywords 반환 (없으면 빈 배열)
    return {
        keywords: Array.isArray(result?.keywords) ? result.keywords : [],
    };
};

/**
 * AI 여행 계획 생성 (강력한 디버깅 및 파싱 적용)
 */
export const fetchAiPlan = async (keywords) => {
    const sanitizedKeywords = Array.isArray(keywords)
        ? keywords
            .map((kw) => (kw === null || kw === undefined ? "" : String(kw).trim()))
            .filter(Boolean)
        : [];

    if (!sanitizedKeywords.length) {
        throw new Error("여행 계획을 만들 키워드가 없습니다.");
    }

    console.log("🚀 [AI Plan 요청] 키워드:", sanitizedKeywords);

    // searchApi has the Base URL configured
    const response = await searchApi.post("/api/ai/plan", { keywords: sanitizedKeywords });
    let result = response.data;

    // 1. 전체 응답이 문자열로 온 경우 파싱 (이중 JSON 인코딩 방지)
    if (typeof result === "string") {
        try {
            // "```json ... ```" 같은 마크다운 코드 블록이 포함된 경우 제거
            const cleanedResult = result.replace(/```json|```/g, "").trim();
            result = JSON.parse(cleanedResult);
        } catch (e) {
            console.error("🔥 [AI Plan 오류] JSON 파싱 실패:", e);
            console.log("원본 응답 텍스트:", result);
            result = {};
        }
    }

    // 2. 디버깅을 위해 콘솔에 전체 구조 출력 (F12에서 확인 가능)
    console.log("📦 [AI Plan 응답 원본]:", result);

    // 3. 데이터 위치 찾기 (result, result.data, result.result 등 다양한 깊이 탐색)
    const root = result?.data ?? result?.result ?? result ?? {};

    let title = root.title;
    let description = root.description;
    let schedule = root.schedule;

    // 만약 root.data 안에 한번 더 감싸져 있을 경우 대비 (깊은 탐색)
    if (!schedule && root.data) {
        title = root.data.title ?? title;
        description = root.data.description ?? description;
        schedule = root.data.schedule;
    }

    // 4. schedule이 문자열로 되어 있는 경우 (LLM이 JSON을 문자열로 줄 때) 재파싱
    if (typeof schedule === "string") {
        try {
            console.log("⚠️ schedule이 문자열입니다. 파싱을 시도합니다.");
            schedule = JSON.parse(schedule);
        } catch (e) {
            console.error("schedule 내부 파싱 실패", e);
            schedule = [];
        }
    }

    // 5. 최종 검증: 배열이 아니면 빈 배열 처리
    const finalSchedule = Array.isArray(schedule) ? schedule : [];

    console.log("✅ [AI Plan 최종 데이터]:", { title, description, schedule: finalSchedule });

    return {
        title: title,
        description: description,
        schedule: finalSchedule,
    };
};

/**
 * AI 여자친구(여름이) 채팅 요청
 * URL: /api/girlfriend/chat
 * Method: POST
 */
export const sendAiGirlfriendMessage = async (userMessage) => {
    if (!userMessage || !userMessage.trim()) {
        throw new Error("메시지 내용이 없습니다.");
    }

    try {
        // [변경] searchApi -> api (메인 서버) 로 변경
        // /api/girlfriend/chat 경로는 메인 서버에 위치할 가능성이 높음 (/ai prefix 삭제짐)
        const response = await api.post("/api/girlfriend/chat", {
            userMessage: userMessage
        });
        return response.data; // { reply: "..." }
    } catch (error) {
        console.error("AI Girlfriend Chat Error:", error);
        throw error;
    }
};