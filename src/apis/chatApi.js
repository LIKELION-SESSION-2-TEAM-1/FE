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
// 2. 채팅방 생성
export const createChatRoom = async (roomData) => {
    try {
        // 백엔드 명세 변경: JSON Body로 전달 ({ name, startDate, endDate, travelStyle })
        const response = await api.post('/api/chats/rooms', roomData);
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

// 4. 초대 링크 생성
export const createInviteLink = async (chatRoomId) => {
    try {
        const response = await api.post(`/api/chats/rooms/${chatRoomId}/invite-link`);
        return response.data; // { roomId, inviteCode, inviteUrl }
    } catch (error) {
        console.error('초대 링크 생성 실패:', error);
        throw error;
    }
};

// 5. 초대 코드로 입장
export const joinChatRoom = async (roomId, inviteCode) => {
    try {
        const response = await api.post(`/api/chats/rooms/${roomId}/join`, { inviteCode });
        return response.data;
    } catch (error) {
        console.error('초대 코드로 입장 실패:', error);
        throw error;
    }
};

// 6. 멤버 추가 (ID/닉네임 등)
export const addMember = async (chatRoomId, identifier) => {
    try {
        // 기존 POST /api/chats/rooms/{roomId}/members
        const response = await api.post(`/api/chats/rooms/${chatRoomId}/members`, { identifier });
        return response.data;
    } catch (error) {
        console.error('멤버 추가 실패:', error);
        throw error;
    }
};

// 7. 사용자 검색
// 7. 사용자 검색 (채팅방 초대용)
export const searchUser = async (identifier) => {
    try {
        // Spec: GET /api/chats/users/search?identifier=...
        const response = await api.get(`/api/chats/users/search`, { params: { identifier } });
        return response.data; // { userId, displayName, username }
    } catch (error) {
        console.error('사용자 검색 실패:', error);
        throw error;
    }
};

// 8. 멤버 목록/수 조회
export const getChatRoomMembers = async (chatRoomId) => {
    try {
        const response = await api.get(`/api/chats/rooms/${chatRoomId}/members`);
        return response.data; // { roomId, memberCount, members: [...] }
    } catch (error) {
        console.error('멤버 목록 조회 실패:', error);
        throw error;
    }
};

// 9. 방 폭파 (삭제)
export const deleteChatRoom = async (chatRoomId) => {
    try {
        await api.delete(`/api/chats/rooms/${chatRoomId}`);
    } catch (error) {
        console.error('채팅방 삭제 실패:', error);
        throw error;
    }
};
