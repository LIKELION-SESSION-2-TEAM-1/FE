import styles from './ChatRoom.module.css';
import send from "../../../assets/pic/send.svg";

import { useEffect, useMemo, useRef, useState } from 'react';
import WSClient from '../../../websocket/WebSocket';
import ChatHeader from '../../../components/ChatHeader/ChatHeader';

const ChatRoom = () => {
    const [hasText, setHasText] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");

    const listRef = useRef(null);
    const inputRef = useRef(null);

    const ws = useMemo(() => new WSClient(undefined, { reconnect: false }), []);

    useEffect(() => {
        ws.on("open", () => setError(""));
        ws.on("message", (msg) => {
            const asObj = typeof msg === "string" ? { raw: msg } : msg;
            if (asObj?.messageType === "TALK" || asObj?.message) {
                setMessages((prev) => [asObj, ...prev]);
            }
        });
        ws.on("error", (err) => {
            setError(err?.message || "웹소켓 통신 오류가 발생했습니다.");
        });
        ws.on("close", () => {
            setError("서버와의 연결이 종료되었습니다.");
        });

        ws.connect();

        return () => {
            ws.close();
        };
    }, [ws]);

    const handleInput = (e) => {
        const v = e.target.value;
        setText(v);
        setHasText(v.trim().length > 0);
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const talk = WSClient.buildTalkMessage({ text: trimmed, senderName: "tester" });

        try {
            ws.send(talk);
            setMessages((prev) => [talk, ...prev]);
            setText("");
            setHasText(false);
            inputRef.current?.focus();
        } catch (e) {
            setError(e?.message || "메시지 전송에 실패했습니다.");
        }
    };
        
    return (
        <div className={styles.chat__wrapper}>
            <div className={styles.chat__container}>
                <ChatHeader/>

                {error && (
                    <div className={styles.errorBanner} role="alert">
                        {error}
                    </div>
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