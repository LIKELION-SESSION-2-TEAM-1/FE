import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const API_BASE_URL = "https://port-0-tokplan-mild533144fe3281.sel3.cloudtype.app/";

// 백엔드 STOMP 전용 엔드포인트 및 pub/sub 경로
const WS_ENDPOINT = `${API_BASE_URL.replace(/\/$/, "")}/stomp-ws`;
const PUB_ENDPOINTS = (roomId) => [`/pub/chat/${roomId}`];
const SUB_ENDPOINTS = (roomId) => [`/sub/chat/${roomId}`];

export default class WSClient {
    constructor({ roomId, reconnectDelay = 5000 } = {}) {
        this.roomId = roomId ?? 0;
        this.reconnectDelay = reconnectDelay;
        this.client = null;
        this.subscriptions = [];
        this.connected = false;
        this.onMessage = null; // 메시지 수신 시 실행할 콜백
        this.onConnect = null; // 연결 성공 시 실행할 콜백
        this.onDisconnect = null; // 연결 종료 시 실행할 콜백
        this.listeners = {
            open: new Set(),
            message: new Set(),
            error: new Set(),
            close: new Set(),
        };
    }

    // 연결 시작
    connect({ onMessage, onConnect, onDisconnect } = {}) {
        if (this.client?.active) return; // 이미 활성화된 경우 중복 연결 방지

        this.onMessage = onMessage;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_ENDPOINT),
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            
            onConnect: (frame) => {
                console.log('[WS] Connected');
                this.connected = true;
                this._subscribe(); // 연결되면 구독 설정
                if (this.onConnect) this.onConnect(frame);
                this._emit("open");
            },
            
            onStompError: (frame) => {
                console.error('[WS] Broker reported error: ' + frame.headers['message']);
                console.error('[WS] Additional details: ' + frame.body);
                this._emit("error", new Error(frame?.headers?.message || "STOMP error"));
            },

            onWebSocketClose: () => {
                console.log('[WS] Closed');
                this.connected = false;
                if (this.onDisconnect) this.onDisconnect();
                this._emit("close");
            }
        });

        this.client = client;
        client.activate();
    }

    // 구독 설정 (내부용)
    _subscribe() {
        if (!this.client || !this.client.connected) return;

        // 기존 구독 해제
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];

        // 설정된 모든 엔드포인트 구독
        SUB_ENDPOINTS(this.roomId).forEach(dest => {
            const sub = this.client.subscribe(dest, (message) => {
                if (!message.body) return;
                try {
                    const payload = JSON.parse(message.body);
                    this.onMessage?.(payload);
                    this._emit("message", payload);
                } catch (e) {
                    console.error('[WS] JSON Parse Error', e);
                    const raw = { raw: message.body };
                    this.onMessage?.(raw);
                    this._emit("message", raw);
                }
            });
            this.subscriptions.push(sub);
        });
    }

    // 메시지 전송
    send(messageObj) {
        if (!this.client || !this.client.connected) {
            console.warn('[WS] Cannot send message: Client not connected');
            return;
        }

        const payload = JSON.stringify(messageObj);

        PUB_ENDPOINTS(this.roomId).forEach(dest => {
            this.client.publish({
                destination: dest,
                body: payload
            });
        });
    }

    // 연결 종료
    disconnect() {
        if (this.client) {
            this.client.deactivate();
            console.log('[WS] Disconnected by user');
        }
        this.connected = false;
        this.subscriptions = [];
        this._emit("close");
    }

    on(event, handler) {
        this.listeners[event]?.add(handler);
        return () => this.off(event, handler);
    }

    off(event, handler) {
        this.listeners[event]?.delete(handler);
    }

    _emit(event, ...args) {
        this.listeners[event]?.forEach((fn) => fn(...args));
    }

    // 메시지 객체 생성 헬퍼
    static buildTalkMessage({ text, senderName = "User", chatRoomId = 0 }) {
        // 임시 ID 생성 (서버 응답 전 UI 표시용)
        const tempId = `temp-${Date.now()}`;
        return {
            // id: undefined, // 서버에서 생성
            chatRoomId: chatRoomId,
            senderUserId: 0, // 로그인한 유저 ID (필요시 수정)
            senderName: senderName,
            receiverUserId: 0,
            receiverName: "",
            message: text,
            messageType: "TALK", // JOIN, TALK 등
            ts: new Date().toISOString(),
            clientTempId: tempId
        };
    }

    // --- REST API Helpers ---

    static async fetchRooms() {
        try {
            const res = await fetch(`${API_BASE_URL}api/chats/rooms`);
            if (!res.ok) throw new Error("Failed to fetch rooms");
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async createRoom(name = "새 채팅방") {
        try {
            const res = await fetch(`${API_BASE_URL}api/chats/rooms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, roomId: 0, id: "" }), // API 스펙에 맞춤
            });
            if (!res.ok) throw new Error("Failed to create room");
            return await res.json();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async fetchChats(chatRoomId) {
        try {
            const res = await fetch(`${API_BASE_URL}api/chats/${chatRoomId}`);
            if (!res.ok) throw new Error("Failed to fetch chats");
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}