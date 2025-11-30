const API_BASE_URL = "https://port-0-tokplan-mild533144fe3281.sel3.cloudtype.app/";
const WS_PATHS = ["", "/ws", "/ws/chat", "/stomp-ws", "/ws-stomp", "/socket"];
const DEFAULT_WS_URLS = WS_PATHS.map((p) => API_BASE_URL.replace(/\/$/, "").replace(/^http/, "ws") + p);

export default class WSClient {
    constructor(urls = DEFAULT_WS_URLS, { reconnect = false, reconnectDelay = 2000 } = {}) {
        this.urls = Array.isArray(urls) ? urls : [urls];
        this._urlIndex = 0;
        this.reconnect = reconnect;
        this.reconnectDelay = reconnectDelay;

        this.ws = null;
        this.connected = false;
        this._shouldReconnect = reconnect;
        this._connecting = false;
        this._pendingMessages = [];
        this._currentUrl = null;

        this.listeners = {
            open: new Set(),
            message: new Set(),
            error: new Set(),
            close: new Set(),
        };
    }

    connect() {
        if (this.connected || this._connecting) return;
        this._tryConnect(this._urlIndex);
    }

    send(data) {
        const payload = typeof data === "string" ? data : JSON.stringify(data);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(payload);
        } else {
            this._pendingMessages.push(payload);
            if (!this._connecting) {
                this._tryConnect();
            }
        }
    }

    close() {
        try {
            this._shouldReconnect = false;
            this.ws?.close();
        } catch {
        }
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

    _tryConnect(idx = 0) {
        const targetUrl = this.urls[idx];
        if (!targetUrl) {
            this._connecting = false;
            return;
        }

        try {
            this._connecting = true;
            this._currentUrl = targetUrl;
            this.ws = new WebSocket(targetUrl);

            this.ws.onopen = () => {
                this.connected = true;
                this._connecting = false;
                this._emit("open");
                if (this._pendingMessages.length) {
                    this._pendingMessages.forEach((p) => this.ws.send(p));
                    this._pendingMessages = [];
                }
            };

            this.ws.onmessage = (evt) => {
                const raw = evt.data;
                let parsed = raw;
                try {
                    parsed = JSON.parse(raw);
                } catch {
                }
                this._emit("message", parsed);
            };

            this.ws.onerror = () => {};

            this.ws.onclose = () => {
                const wasConnected = this.connected;
                this.connected = false;
                this._connecting = false;

                // 초기 연결 실패 시 다음 경로 시도
                if (!wasConnected) {
                    this._urlIndex = idx + 1;
                    setTimeout(() => this._tryConnect(this._urlIndex), this.reconnectDelay);
                    return;
                }

                // 연결 후 끊어지면 첫 번째 경로부터 재시도
                if (this._shouldReconnect) {
                    setTimeout(() => {
                        this._urlIndex = 0;
                        this._tryConnect(0);
                    }, this.reconnectDelay);
                }
            };
        } catch {
            this._connecting = false;
            setTimeout(() => this._tryConnect(idx + 1), this.reconnectDelay);
        }
    }

    static buildTalkMessage({ text, senderName = "tester", chatRoomId = 1 }) {
        return {
            id: undefined,
            chatRoomId,
            senderUserId: 1,
            senderName,
            receiverUserId: 0,
            receiverName: "",
            message: text,
            messageType: "TALK",
            ts: new Date().toISOString(),
        };
    }

    static async fetchRooms() {
        const res = await fetch(`${API_BASE_URL}api/chats/rooms`);
        if (!res.ok) {
            throw new Error("채팅방 목록을 불러오지 못했습니다.");
        }
        return res.json();
    }

    static async createRoom(body = { name: "새 채팅방" }) {
        const res = await fetch(`${API_BASE_URL}api/chats/rooms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new Error("채팅방 생성에 실패했습니다.");
        }
        return res.json();
    }

    static async fetchChats(chatRoomId) {
        const res = await fetch(`${API_BASE_URL}api/chats/${chatRoomId}`);
        if (!res.ok) {
            throw new Error("채팅 내역을 불러오지 못했습니다.");
        }
        return res.json();
    }
}
