import styles from './ChatRoom.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WSClient from '../../../websocket/WebSocket'; 
import { fetchAiKeywords, fetchAiPlan } from '../../../apis/aiApi';
import sendIcon from "../../../assets/pic/send.svg";
import searchIcon from "../../../assets/pic/search.svg";
import menuIcon from "../../../assets/pic/menu.svg";
import backIcon from "../../../assets/pic/arrow2.svg";
import pic2 from "../../../assets/pic/pic2.png";

const ChatRoom = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [activeRoom, setActiveRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aiKeywords, setAiKeywords] = useState([]);
    const [aiPlan, setAiPlan] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [aiInsertIndex, setAiInsertIndex] = useState(null);
    
    // [수정] 스크롤 제어를 위한 Ref 추가
    const messagesEndRef = useRef(null);
    const messagesRef = useRef([]);
    
    // 내 정보 관리
    const [me] = useState(() => {
        const savedId = sessionStorage.getItem("chat_userId");
        const savedName = sessionStorage.getItem("chat_userName");

        if (savedId && savedName) {
            return { userId: parseInt(savedId), userName: savedName };
        }
        
        const newId = Math.floor(Math.random() * 100000); 
        const newName = `User_${newId}`;
        
        sessionStorage.setItem("chat_userId", newId);
        sessionStorage.setItem("chat_userName", newName);
        
        return { userId: newId, userName: newName };
    });

    const ws = useMemo(() => new WSClient({ reconnectDelay: 4000 }), []);

    // 내 프로필 색상 (고정)
    const myGradient = "linear-gradient(135deg, #ffd77a, #ff9a3c)";

    const getUserColor = (id, name) => {
        const key = id ? String(id) : name;
        if (!key) return "#ddd";
        
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    // [수정] 메시지가 업데이트될 때마다 자동으로 스크롤 하단 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        if (aiKeywords.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [aiKeywords]);

    useEffect(() => {
        const init = async () => {
            try {
                const rooms = await WSClient.fetchRooms();
                let room = Array.isArray(rooms) && rooms.length ? rooms[0] : null;
                if (!room) room = await WSClient.createRoom("부산 여행");
                setActiveRoom(room);

<<<<<<< HEAD
                const roomId = room?.roomId ?? room?.id ?? 0;
                const data = await WSClient.fetchChats(roomId);
                if (cancelled) return;
                const arr = Array.isArray(data) ? data.slice() : [];
                setMessages(arr);
                scrollToBottom();
            } catch (err) {
                console.error("Bootstrap error:", err);
                setError("채팅방 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
        const offErr = ws.on("error", () => { });
        const offClose = ws.on("close", () => { });

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
=======
                const roomId = room?.roomId ?? room?.id ?? 1;
                
                const history = await WSClient.fetchChats(roomId);
                if (Array.isArray(history) && history.length) {
                    setMessages(history);
>>>>>>> 124aaf6b95c0d5557f719d33444979aa0f122e89
                }

                ws.roomId = roomId;
                ws.connect({
                    onMessage: (msg) => handleReceive(msg, roomId),
                });
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
        return () => ws.disconnect();
    }, [ws]);

    const keyOf = (m) =>
        m?.id ||
        m?.clientTempId ||
        `${m?.chatRoomId}-${m?.senderUserId}-${m?.ts}`;

    const handleReceive = (msg, roomId) => {
        if (msg.chatRoomId && msg.chatRoomId !== roomId) return;
        setMessages((prev) => {
            const exists = prev.some((m) => keyOf(m) === keyOf(msg));
            return exists ? prev : [...prev, msg];
        });
    };

    const handleSend = () => {
<<<<<<< HEAD
        const trimmed = text.trim();
        if (!trimmed) return;
        if (!activeRoom) {
            alert("채팅방 정보가 없습니다. 새로고침 해주세요.");
            return;
        }

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
                {error && (
                    <div className={styles.errorBanner}>{error}</div>
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
=======
        if (!text.trim() || !activeRoom) return;
        const roomId = activeRoom?.roomId ?? activeRoom?.id ?? 1;
        
        let payload = WSClient.buildTalkMessage({
            text,
            senderName: me.userName,
            chatRoomId: roomId,
        });
        payload.senderUserId = me.userId; 

        ws.send(payload);
        setText("");
    };

    const handleAiAnalyze = async () => {
        if (aiLoading || !activeRoom) return;
        const roomId = activeRoom?.roomId ?? activeRoom?.id ?? 1;
        setAiLoading(true);
        setAiError(null);
        setAiPlan(null);
        setAiInsertIndex(null);
        setAiKeywords([]);
        try {
            const result = await fetchAiKeywords(roomId);
            const keywords = Array.isArray(result?.keywords) ? result.keywords : [];
            const normalizedKeywords = keywords
                .map((kw) => (kw === null || kw === undefined ? "" : String(kw).trim()))
                .filter(Boolean);

            if (!normalizedKeywords.length) {
                throw new Error("AI가 키워드를 찾지 못했습니다.");
            }

            const insertIndex = messagesRef.current.length;
            setAiKeywords(normalizedKeywords);
            setAiInsertIndex(insertIndex);

            try {
                const planResult = await fetchAiPlan(normalizedKeywords);
                setAiPlan(planResult);
            } catch (planError) {
                console.error(planError);
                setAiError(planError?.message || "여행 계획 생성에 실패했습니다.");
            }
        } catch (e) {
            console.error(e);
            setAiError(e?.message || "AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.isComposing || e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isLoading) return <div className={styles.loadingScreen}>채팅방에 입장 중입니다...</div>;

    const renderAiBlock = () => {
        const schedule = Array.isArray(aiPlan?.schedule) ? aiPlan.schedule : [];

        return (
            <div className={styles.aiKeywordCard}>
                <p className={styles.aiKeywordTitle}>
                    AI 분석을 통해 현재 채팅방의 여행 핵심 키워드를 정리해드려요!
                </p>
                <div className={styles.aiKeywordList}>
                    {aiKeywords.map((kw, idx) => (
                        <span key={`${kw}-${idx}`} className={styles.aiKeywordChip}>{kw}</span>
                    ))}
                </div>

                <div className={styles.aiPlanSection}>
                    <div className={styles.aiPlanHeader}>
                        <div className={styles.aiPlanHeadingText}>
                            <p className={styles.aiPlanLabel}>여행 계획</p>
                            {aiPlan?.title && <h4 className={styles.aiPlanTitle}>{aiPlan.title}</h4>}
                        </div>
                        {aiLoading && !aiPlan && <span className={styles.aiPlanBadge}>생성 중...</span>}
>>>>>>> 124aaf6b95c0d5557f719d33444979aa0f122e89
                    </div>
                    {aiPlan?.description && (
                        <p className={styles.aiPlanDescription}>{aiPlan.description}</p>
                    )}

                    {schedule.length > 0 ? (
                        <div className={styles.aiPlanDays}>
                            {schedule.map((dayPlan, idx) => {
                                const places = Array.isArray(dayPlan?.places) ? dayPlan.places : [];
                                const dayLabel =
                                    dayPlan?.day === 0 || dayPlan?.day
                                        ? `Day ${dayPlan.day}`
                                        : `Day ${idx + 1}`;

                                return (
                                    <div key={`day-${idx}`} className={styles.aiPlanDay}>
                                        <div className={styles.aiPlanDayTitle}>{dayLabel}</div>
                                        <div className={styles.aiPlanPlaces}>
                                            {places.map((place, pIdx) => (
                                                <div key={`place-${pIdx}`} className={styles.aiPlanPlace}>
                                                    <div className={styles.aiPlanPlaceName}>{place?.name || "추천 장소"}</div>
                                                    <div className={styles.aiPlanPlaceMeta}>
                                                        {place?.category && <span>{place.category}</span>}
                                                        {place?.address && <span>{place.address}</span>}
                                                    </div>
                                                    {place?.distanceToNext && (
                                                        <div className={styles.aiPlanDistance}>다음까지 {place.distanceToNext}</div>
                                                    )}
                                                </div>
                                            ))}
                                            {places.length === 0 && (
                                                <div className={styles.aiPlanEmpty}>추천 장소 정보가 없습니다.</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className={styles.aiPlanEmpty}>
                            {aiLoading ? "여행 계획을 구성하고 있습니다..." : "생성된 여행 계획이 없습니다."}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const shouldRenderAi = aiKeywords.length > 0 && aiInsertIndex !== null;

    return (
        <div className={styles.screen}>
            <div className={styles.topBarWrapper}>
                <header className={styles.topBar}>
                    <button className={styles.navBtn} onClick={() => navigate(-1)} aria-label="back">
                        <img src={backIcon} alt="back" />
                    </button>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>부산 여행</h1>
                        <span className={styles.memberCount}>6</span>
                    </div>
                    <div className={styles.topIcons}>
                        <img className={styles.iconImg} src={searchIcon} alt="search" />
                        <img className={styles.iconImg} src={menuIcon} alt="menu" />
                    </div>
                </header>
                <div className={styles.aiToolbar}>
                    <button
                        className={styles.aiButton}
                        onClick={handleAiAnalyze}
                        disabled={aiLoading || !activeRoom}
                    >
                        {aiLoading ? "분석 중..." : "AI 키워드 분석"}
                    </button>
                    {aiError && <span className={styles.aiError}>{aiError}</span>}
                </div>
            </div>

            <div className={styles.messageList}>
                {shouldRenderAi && aiInsertIndex === 0 && renderAiBlock()}
                {messages.map((m, idx) => {
                    const isMe = (m.senderUserId === me.userId) || (!m.senderUserId && m.senderName === me.userName);
                    const avatarImg = m.senderName === "민수" ? pic2 : null;
                    const avatarStyle = isMe 
                        ? { background: myGradient } 
                        : { background: getUserColor(m.senderUserId, m.senderName) };

                    return (
                        <React.Fragment key={keyOf(m)}>
                            <div
                                className={`${styles.messageRow} ${isMe ? styles.myRow : styles.otherRow}`}
                            >
                                {!isMe && (
                                    <>
                                        {avatarImg ? (
                                            <img className={styles.avatar} src={avatarImg} alt={m.senderName} />
                                        ) : (
                                            <div 
                                                className={styles.unknownAvatar} 
                                                style={avatarStyle} 
                                                aria-label={m.senderName} 
                                            />
                                        )}
                                        <div className={styles.bubbleWrap}>
                                            <div className={styles.senderName}>{m.senderName}</div>
                                            <div className={`${styles.bubble} ${styles.otherBubble}`}>
                                                {m.message}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isMe && (
                                    <>
                                        <div className={styles.bubbleWrap}>
                                            <div 
                                                className={styles.senderName} 
                                                style={{ textAlign: 'right', marginRight: '4px' }}
                                            >
                                                me
                                            </div>
                                            <div className={`${styles.bubble} ${styles.myBubble}`}>
                                                {m.message}
                                            </div>
                                        </div>
                                        {avatarImg ? (
                                            <img className={styles.avatar} src={avatarImg} alt={m.senderName} />
                                        ) : (
                                            <div 
                                                className={styles.unknownAvatar} 
                                                style={avatarStyle} 
                                                aria-label="me" 
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            {shouldRenderAi && aiInsertIndex === idx + 1 && renderAiBlock()}
                        </React.Fragment>
                    );
                })}
                {shouldRenderAi && aiInsertIndex > messages.length && renderAiBlock()}
                {/* [수정] 스크롤 자동 이동을 위한 보이지 않는 앵커(Anchor) */}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputBar}>
                <input
                    className={styles.input}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메세지를 입력하세요"
                />
                <button className={styles.sendBtn} onClick={handleSend} disabled={!text.trim()} aria-label="send">
                    <img src={sendIcon} alt="" />
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
