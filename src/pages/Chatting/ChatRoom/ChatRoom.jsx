import styles from './ChatRoom.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WSClient from '../../../websocket/WebSocket'; 
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
    const listRef = useRef(null);
    
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

    // [수정] chat.html 스타일의 랜덤 색상 생성기
    // 유저의 ID나 이름을 기반으로 고유한 HEX 색상을 생성합니다.
    // 이렇게 하면 유저마다 색상이 고정되면서도(구분 가능), 서로 다른 색상을 가질 확률이 매우 높아집니다.
    const getUserColor = (id, name) => {
        const key = id ? String(id) : name;
        if (!key) return "#ddd";
        
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // 16진수 색상 코드로 변환 (ex: #A1F2C3)
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        });
    };

    useEffect(() => {
        const init = async () => {
            try {
                const rooms = await WSClient.fetchRooms();
                let room = Array.isArray(rooms) && rooms.length ? rooms[0] : null;
                if (!room) room = await WSClient.createRoom("부산 여행");
                setActiveRoom(room);

                const roomId = room?.roomId ?? room?.id ?? 1;
                
                const history = await WSClient.fetchChats(roomId);
                if (Array.isArray(history) && history.length) {
                    setMessages(history);
                }

                ws.roomId = roomId;
                ws.connect({
                    onMessage: (msg) => handleReceive(msg, roomId),
                });
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
                scrollToBottom();
            }
        };
        init();
        return () => ws.disconnect();
    }, [ws]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const handleKeyDown = (e) => {
        if (e.isComposing || e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isLoading) return <div className={styles.loadingScreen}>채팅방에 입장 중입니다...</div>;

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
            </div>

            <div className={styles.messageList} ref={listRef}>
                {messages.map((m) => {
                    // 본인 판별
                    const isMe = (m.senderUserId === me.userId) || (!m.senderUserId && m.senderName === me.userName);
                    
                    const avatarImg = m.senderName === "민수" ? pic2 : null;
                    
                    // [수정] 이제 팔레트 인덱스가 아닌 Hex Color를 직접 할당합니다.
                    const avatarStyle = isMe 
                        ? { background: myGradient } 
                        : { background: getUserColor(m.senderUserId, m.senderName) };

                    return (
                        <div
                            key={keyOf(m)}
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
                    );
                })}
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