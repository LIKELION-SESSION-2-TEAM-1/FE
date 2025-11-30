import styles from './ChatRoom.module.css';
import send from "../../../assets/pic/send.svg";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WSClient from '../../../websocket/WebSocket';
import ChatHeader from '../../../components/ChatHeader/ChatHeader';

const ChatRoom = () => {
    const navigate = useNavigate();
    const [hasText, setHasText] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [activeRoom, setActiveRoom] = useState(null);
    const pollingRef = useRef(null);

    const listRef = useRef(null);
    const inputRef = useRef(null);

    const ws = useMemo(() => new WSClient(undefined, { reconnect: true }), []);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            const el = listRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        });
    };

    const mergeMessages = (nextList) => {
        const keyOf = (m) =>
            m?.clientTempId ||
            m?.id ||
            `${m.chatRoomId ?? ""}-${m.senderName ?? ""}-${m.messageType ?? ""}-${m.message ?? ""}`;

        setMessages((prev) => {
            const map = new Map();
            [...prev, ...(nextList || [])].forEach((m) => {
                const key = keyOf(m);
                if (!map.has(key)) {
                    map.set(key, m);
                } else {
                    // 서버 응답(아이디/타임스탬프 포함)을 우선 저장
                    const existing = map.get(key);
                    if (m?.id && !existing?.id) {
                        map.set(key, m);
                    } else if (m?.ts && !existing?.ts) {
                        map.set(key, m);
                    }
                }
            });
            return Array.from(map.values());
        });
    };

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            try {
                const rooms = await WSClient.fetchRooms();
                let room = Array.isArray(rooms) && rooms.length ? rooms[0] : null;
                if (!room) {
                    room = await WSClient.createRoom({ name: "새 채팅방" });
                }
                if (cancelled) return;
                setActiveRoom(room);

                const roomId = room?.roomId ?? room?.id ?? 0;
                const data = await WSClient.fetchChats(roomId);
                if (cancelled) return;
                const arr = Array.isArray(data) ? data.slice() : [];
                setMessages(arr);
                scrollToBottom();
            } catch {
                // 조용히 진행
            } finally {
                if (!cancelled) setLoadingHistory(false);
            }
        };

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const offOpen = ws.on("open", () => {
            scrollToBottom();
        });
        const offMsg = ws.on("message", (msg) => {
            const asObj = typeof msg === "string" ? { raw: msg } : msg;
            const roomId = activeRoom?.roomId ?? activeRoom?.id ?? null;
            if (roomId !== null && asObj?.chatRoomId !== undefined && asObj.chatRoomId !== roomId) {
                return;
            }
            if (asObj?.messageType === "TALK" || asObj?.message) {
                mergeMessages([asObj]);
            }
        });
        const offErr = ws.on("error", () => {});
        const offClose = ws.on("close", () => {});

        ws.connect();

        return () => {
            offOpen();
            offMsg();
            offErr();
            offClose();
            ws.close();
        };
    }, [ws, activeRoom]);

    useEffect(() => {
        if (!activeRoom) return;
        if (pollingRef.current) clearInterval(pollingRef.current);

        const roomId = activeRoom?.roomId ?? activeRoom?.id ?? 0;
        const poll = async () => {
            try {
                const data = await WSClient.fetchChats(roomId);
                if (Array.isArray(data)) {
                    mergeMessages(data);
                }
            } catch {
                // silent
            }
        };

        poll(); // initial
        pollingRef.current = setInterval(poll, 3000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [activeRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInput = (e) => {
        const v = e.target.value;
        setText(v);
        setHasText(v.trim().length > 0);
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (!activeRoom) return;

        const roomId = activeRoom?.roomId ?? activeRoom?.id ?? 0;
        const clientTempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const talk = {
            ...WSClient.buildTalkMessage({ text: trimmed, senderName: "뿡뻉", chatRoomId: roomId }),
            clientTempId,
        };

        setText("");
        setHasText(false);
        inputRef.current?.focus();

        // WS 전송 시도 및 낙관적 UI 업데이트
        mergeMessages([talk]);
        ws.send(talk);
    };
        
    return (
        <div className={styles.chat__wrapper}>
            <div className={styles.chat__container}>
                <ChatHeader onBack={() => navigate('/chatlist')} />

                {loadingHistory && (
                    <div className={styles.loading}>채팅 내역을 불러오는 중...</div>
                )}

                <div className={styles.listWrapper}>
                    <div className={styles.list} ref={listRef} aria-live="polite">
                        {messages.map((m, idx) => (
                        <div key={m.ts ? `${m.ts}-${idx}` : idx} className={styles.msgBox}>
                            <div className={styles.meta}>
                                <span className={styles.name}>{m.senderName ?? 'unknown'}</span>
                                <span className={styles.time}>
                                    {m.ts ? new Date(m.ts).toLocaleString() : ''}
                                </span>
                            </div>
                            <div className={styles.text}>{m.message ?? m.raw ?? ''}</div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className={styles.message__wrapper}>
                    <div className={styles.composer}>
                        <textarea ref={inputRef} className={styles.input} placeholder="메세지를 입력하세요" rows={1} aria-label="메세지 입력" value={text} onInput={handleInput} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                        <button type="button" className={`${styles.sendBtn} ${hasText ? styles.sendBtnActive : ''}`} aria-label="메세지 전송" onClick={handleSend} disabled={!hasText} title={!hasText ? "메시지를 입력하세요" : "전송"}>
                            <img src={send} alt="" className={styles.sendIcon} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatRoom;
