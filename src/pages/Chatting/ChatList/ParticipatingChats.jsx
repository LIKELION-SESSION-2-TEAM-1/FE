import React, { useState, useEffect } from 'react';
import styles from './ChatList.module.css';
import roomImg from '../../../assets/pic/chatlist_pic.png'; // Fallback image or default
import searchIcon from '../../../assets/pic/search.svg';
import { useNavigate } from 'react-router-dom';
import { getChatRooms } from '../../../apis/chatApi';

const ParticipatingChats = () => {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getChatRooms();
                // 백엔드 응답이 배열인지 확인
                if (Array.isArray(data)) {
                    setChatRooms(data);
                } else {
                    console.warn('채팅방 목록 데이터 형식이 배열이 아닙니다:', data);
                }
            } catch (error) {
                console.error('채팅방 목록 로드 실패:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleRoomClick = (roomId) => {
        // 채팅방 상세 페이지로 이동 (ID 전달)
        // navigate(`/chatroom/${roomId}`); // 향후 동적 라우팅 적용 시
        navigate('/chatroom'); // 현재는 정적 라우팅 유지
    };

    return (
        <div className={styles.participatingContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>참여중인 여행톡</span>
                <img className={styles.searchIcon} src={searchIcon} alt="검색" />
            </div>

            {chatRooms.length === 0 ? (
                // <p className={styles.noRooms}>참여 중인 채팅방이 없습니다.</p>
                // 예시로 기존 정적 데이터 하나를 보여줄지, 아니면 비어있음을 보여줄지 결정.
                // 현재는 기존 UI 유지를 위해, 데이터가 없을 때만 하드코딩 된 예시를 잠시 보여주거나,
                // 완전히 리얼 데이터만 보여줄 수도 있음. 
                // 요청사항: "채팅방 조회할 수 있도록 진짜 만들어줘" -> 리얼 데이터만 렌더링하도록 함.
                <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                    참여 중인 채팅방이 없습니다.
                </div>
            ) : (
                chatRooms.map((room) => (
                    <div
                        key={room.roomId || room.room_id || Math.random()} // Unique key fallback
                        className={styles.roomCard}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleRoomClick(room.roomId)}
                    >
                        <img className={styles.roomImage} src={roomImg} alt="채팅방 이미지" />
                        <div className={styles.roomContent}>
                            <div className={styles.roomTopRow}>
                                {/* room.name: 백엔드에서 내려주는 방 이름 필드명 확인 필요 */}
                                <span className={styles.roomTitle}>{room.name || '알 수 없는 대화방'}</span>
                                {/* 시간 정보가 있다면 room.lastMessageTime 등으로 표시 */}
                                <span className={styles.roomTime}></span>
                            </div>
                            <div className={styles.roomMessageRow}>
                                {/* 읽지 않은 메시지 표시 로직은 추후 구현 */}
                                {/* <span className={styles.roomUnreadDot} aria-hidden /> */}
                                <div className={styles.roomMessage}>
                                    {/* 마지막 메시지나 방 설명 등 */}
                                    채팅방이 생성되었습니다.
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ParticipatingChats;
