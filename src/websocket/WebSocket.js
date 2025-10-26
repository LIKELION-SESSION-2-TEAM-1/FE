const DEFAULT_URL =
    (typeof window !== "undefined" && window.location?.protocol === "https:" ? "wss://" : "ws://") +
    "54.180.2.181:8080/stomp-ws";

export default class WSClient {
    constructor(url = DEFAULT_URL, { reconnect = false, reconnectDelay = 2000 } = {}) {
        this.url = url;
        this.reconnect = reconnect;
        this.reconnectDelay = reconnectDelay;

        this.ws = null;
        this.connected = false;

        this.listeners = {
        open: new Set(),
        message: new Set(),
        error: new Set(),
        close: new Set(),
        };
    }

    connect() {
        try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            this.connected = true;
            this._emit("open");
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

        this.ws.onerror = (err) => {
            this._emit("error", new Error("웹소켓 통신 에러가 발생했습니다."));
        };

        this.ws.onclose = () => {
            this.connected = false;
            this._emit("close");
            if (this.reconnect) {
            setTimeout(() => this.connect(), this.reconnectDelay);
            }
        };
        } catch (err) {
        this._emit("error", new Error("웹소켓 연결 시도에 실패했습니다."));
        }
    }

    send(data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        throw new Error("웹소켓이 연결되지 않았습니다.");
        }
        const payload = typeof data === "string" ? data : JSON.stringify(data);
        this.ws.send(payload);
    }

    close() {
        try {
        this.reconnect = false;
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

    static buildTalkMessage({ text, senderName = "tester" }) {
        return {
        chatRoomId: 1,
        senderUserId: 1,
        senderName,
        message: text,
        messageType: "TALK",
        ts: new Date().toISOString(),
        };
    }
}