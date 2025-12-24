import styles from './ChatRoom.module.css';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WSClient from '../../../websocket/WebSocket';
import { fetchAiKeywords, fetchAiPlan } from '../../../apis/aiApi';
import { getProfile } from '../../../apis/api';
import { getChatHistory, createInviteLink, addMember, getChatRoomMembers, deleteChatRoom } from '../../../apis/chatApi'; // [추가] API
import UserSearchModal from '../ChatList/UserSearchModal'; // [추가] 멤버 추가 모달 재사용
import sendIcon from "../../../assets/pic/send.svg";
import searchIcon from "../../../assets/pic/search.svg";
import menuIcon from "../../../assets/pic/menu.svg";
import backIcon from "../../../assets/pic/arrow2.svg";
import pic2 from "../../../assets/pic/pic2.png";

// Helper function to generate unique keys for messages
const keyOf = (m) =>
    m?.id ||
    m?.clientTempId ||
    `${m?.chatRoomId}-${m?.senderUserId}-${m?.ts}`;

const ChatRoom = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
    const [me, setMe] = useState(null);

    // [추가] 메뉴 및 모달 상태
    const [showMenu, setShowMenu] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getProfile();
                // 백엔드 User 엔티티의 id(Long)와 nickname/username 사용
                setMe({
                    userId: profile.id || profile.userId, // 백엔드 응답 필드 확인 필요. 보통 id
                    userName: profile.nickname || profile.username
                });
            } catch (error) {
                console.error("Failed to load profile for chat", error);
                // 로그인 안된 경우 처리 (여기서는 임시로 랜덤)
                const newId = Math.floor(Math.random() * 100000);
                setMe({ userId: newId, userName: `Guest_${newId}` });
            }
        };
        loadProfile();
    }, []);

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

    const handleReceive = useCallback((msg, roomId) => {
        if (msg.chatRoomId && msg.chatRoomId !== roomId) return;
        setMessages((prev) => {
            const exists = prev.some((m) => keyOf(m) === keyOf(msg));
            return exists ? prev : [...prev, msg];
        });
    }, []);

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
                // 1. 네비게이션으로 전달된 방 ID 확인
                let roomId = location.state?.roomId;
                let room = null;

                // 2. 전달된 ID가 없으면 목록 조회 후 첫 번째 방 선택 (임시 로직)
                if (!roomId) {
                    const rooms = await WSClient.fetchRooms();
                    if (Array.isArray(rooms) && rooms.length > 0) {
                        // 사용자가 참여 중인 방 중 첫 번째 방을 선택
                        room = rooms[0];
                        roomId = room.roomId || room.room_id || room.id;
                    } else {
                        // 방이 아예 없으면 생성하지 않고 대기하거나 알림
                        console.log("참여 중인 채팅방이 없습니다.");
                        setIsLoading(false);
                        return;
                    }
                } else {
                    // ID가 있으면 (추가 구현 필요: 방 정보 단건 조회 API가 있다면 호출)
                    // 현재는 목록에서 찾거나 기본값 사용
                    const rooms = await WSClient.fetchRooms();
                    room = rooms.find(r => (r.roomId || r.id) === roomId);
                }

                if (roomId) {
                    setActiveRoom(room || { roomId, name: '채팅방' });

                    // WSClient.fetchChats 대신 api.js를 사용하는 getChatHistory 호출 (헤더 자동 포함)
                    const history = await getChatHistory(roomId);
                    if (Array.isArray(history) && history.length) {
                        setMessages(history);
                    }

                    ws.roomId = roomId;
                    ws.connect({
                        onMessage: (msg) => handleReceive(msg, roomId),
                    });

                    // 멤버 수 조회
                    fetchMembers(roomId);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
        return () => ws.disconnect();
    }, [ws, handleReceive, location.state]);

    const handleSend = () => {
        if (!text.trim() || !activeRoom || !me) return;
        const roomId = activeRoom.roomId ?? activeRoom.id;

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

    // [추가] 초기 멤버 수 상태 (기본 1명)
    const [memberCount, setMemberCount] = useState(1);

    // [추가] API import (파일 상단에 추가 필요하지만 여기서는 로직만)
    // import { getChatRoomMembers, deleteChatRoom } from '../../../apis/chatApi';

    const handleCreateInvite = async () => {
        if (!activeRoom) return;
        const roomId = activeRoom.roomId ?? activeRoom.id;
        try {
            const data = await createInviteLink(roomId);
            if (data && data.inviteUrl) {
                // 클립보드 복사
                await navigator.clipboard.writeText(data.inviteUrl);
                alert(`초대 링크가 복사되었습니다!\n${data.inviteUrl}`);
            } else {
                alert("초대 링크 생성에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("초대 링크 생성 중 오류가 발생했습니다.");
        }
        setShowMenu(false);
    };

    const handleAddMemberId = async (identifier) => {
        if (!activeRoom) return;
        const roomId = activeRoom.roomId ?? activeRoom.id;
        try {
            await addMember(roomId, identifier);
            alert(`${identifier}님이 채팅방에 추가되었습니다.`);
            // 멤버 수 갱신
            fetchMembers(roomId);
        } catch (error) {
            console.error(error);
            alert("멤버 추가에 실패했습니다. ID를 확인해주세요.");
        }
        setShowInviteModal(false);
        setShowMenu(false);
    };

    const fetchMembers = async (roomId) => {
        try {
            const data = await getChatRoomMembers(roomId);
            if (data && data.memberCount) {
                setMemberCount(data.memberCount);
            }
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    const handleDeleteRoom = async () => {
        if (!activeRoom) return;
        const roomId = activeRoom.roomId ?? activeRoom.id;
        if (!window.confirm("정말로 채팅방을 삭제하시겠습니까? (방장만 가능합니다)")) return;

        try {
            await deleteChatRoom(roomId);
            alert("채팅방이 삭제되었습니다.");
            navigate('/home'); // 또는 채팅 목록으로 이동
        } catch (error) {
            console.error("Failed to delete room:", error);
            alert("채팅방 삭제에 실패했습니다. 방장 권한이 있는지 확인해주세요.");
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
                        <h1 className={styles.title}>{activeRoom?.name || "채팅방"}</h1>
                        <span className={styles.memberCount}>{memberCount}</span>
                    </div>
                    <div className={styles.topIcons}>
                        <img className={styles.iconImg} src={searchIcon} alt="search" />
                        <div style={{ position: 'relative' }}>
                            <img
                                className={styles.iconImg}
                                src={menuIcon}
                                alt="menu"
                                onClick={() => setShowMenu(!showMenu)}
                                style={{ cursor: 'pointer' }}
                            />
                            {showMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: '0',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    zIndex: 100,
                                    width: '150px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <button
                                        onClick={handleCreateInvite}
                                        style={{ padding: '10px', borderBottom: '1px solid #eee', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                                    >
                                        초대 링크 복사
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowInviteModal(true);
                                        }}
                                        style={{ padding: '10px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                    >
                                        멤버 추가
                                    </button>
                                    <button
                                        onClick={handleDeleteRoom}
                                        style={{ padding: '10px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'red' }}
                                    >
                                        나가기(방삭제)
                                    </button>
                                </div>
                            )}
                        </div>
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
                    const isMe = me && ((m.senderUserId === me.userId) || (!m.senderUserId && m.senderName === me.userName));
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
            {/* [추가] 멤버 추가 모달 */}
            {showInviteModal && (
                <UserSearchModal
                    onClose={() => setShowInviteModal(false)}
                    onConfirm={handleAddMemberId}
                />
            )}
        </div>
    );
};

export default ChatRoom;
