import api from './api';

// 백엔드 기본 URL 설정 (환경 변수 또는 직접 입력)
// api.js의 baseURL을 사용하거나 직접 지정
// const BASE_URL = 'https://port-0-beeee-mjfnlzve18281716.sel3.cloudtype.app'; 

// 1. 채팅방 목록 조회
export const getChatRooms = async () => {
    try {
        const response = await api.get('/api/chats/rooms');
        return response.data;
    } catch (error) {
        console.error('채팅방 목록 가져오기 실패:', error);
        throw error;
    }
};

// 2. 채팅방 생성
export const createChatRoom = async (roomName) => {
    try {
        // 백엔드에서 @RequestParam String name으로 받으므로 params로 전달
        const response = await api.post('/api/chats/rooms', null, {
            params: { name: roomName }
        });
        return response.data;
    } catch (error) {
        console.error('채팅방 생성 실패:', error);
        throw error;
    }
};

// 3. 채팅 내역 조회 (입장 시 사용)
export const getChatHistory = async (chatRoomId) => {
    try {
        const response = await api.get(`/api/chats/${chatRoomId}`);
        return response.data;
    } catch (error) {
        console.error('채팅 내역 가져오기 실패:', error);
        throw error;
    }
};
