import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Trip.module.css';
import AdBanner from '../../components/Banner/AdBanner'; // Import AdBanner
import tripImg from '../../assets/pic/pic1.png'; // Placeholder trip image
import useDataStore from '../../stores/useDataStore'; // To fetch chat rooms
import { getChatRooms } from '../../apis/chatApi'; // API call

const Trip = () => {
    const navigate = useNavigate();
    const { chatRooms, setChatRooms } = useDataStore();
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch chat rooms if not available
    useEffect(() => {
        const fetchRooms = async () => {
            // Only fetch if empty to save calls, or implement stricter cache logic if needed. 
            // Logic copied from ParticipatingChats.jsx partially.
            try {
                const data = await getChatRooms();
                if (Array.isArray(data)) {
                    setChatRooms(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchRooms();
    }, [setChatRooms]);

    // Handle empty state vs trip state
    const rooms = chatRooms || [];
    // If no rooms, show the "Empty Card" purely.
    // However, for the rotating layout, even an empty card could theoretically be part of the stack?
    // No, empty state is usually a single static view.
    // IF at least 1 room exists, show the Stack UI.

    // Helper to determine style based on index
    const getCardStyle = (index) => {
        // Calculate relative index ensuring circularity or just simple list?
        // Let's do simple list boundaries for now or infinite? User said "rotated back parts overlapping"
        // Let's check distance from activeIndex.
        if (index === activeIndex) return 0;
        if (index === activeIndex + 1) return 1;
        if (index === activeIndex + 2) return 2;
        return 'hidden';
    };

    const handleNext = () => {
        if (activeIndex < rooms.length - 1) setActiveIndex(activeIndex + 1);
        else setActiveIndex(0); // Loop back or stop? Loop feels better for "stack".
    };

    // For click on card to bring to front?
    const handleCardClick = (index) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    // To enter chat room
    const enterRoom = (e, roomId) => {
        e.stopPropagation(); // prevent card click
        navigate('/chatroom', { state: { roomId } });
    };

    return (
        <div className={styles.container}>
            {/* Banner Section */}
            <div style={{ width: '100%', maxWidth: '350px' }}>
                <AdBanner />
            </div>

            <div style={{ height: '20px' }}></div>

            {rooms.length === 0 ? (
                /* Empty State */
                <div className={styles.emptyCard}>
                    <div className={styles.emptyText}>
                        참여중인 여행톡이 없어요<br />
                        새로운 여행톡을 만들고<br />
                        ai 여행 일정추천을 받아보세요!
                    </div>
                    <button className={styles.createBtn} onClick={() => navigate('/chat/join')}>
                        새로운 여행계획 시작하기
                    </button>
                </div>
            ) : (
                /* Active Trip Stack */
                <>
                    <div className={styles.cardStackContainer}>
                        {rooms.map((room, index) => {
                            const position = getCardStyle(index);
                            // We need to handle the case where we cycle through. 
                            // Simple approach: Render ALL rooms but apply styles based on distance.
                            // Better approach for stack: Only render active + next few.
                            // But React needs stable keys.

                            // Let's act like a deck: 
                            // Active is top. 
                            // +1 is behind.
                            // +2 is further behind.
                            // How to handle "previous"? Usually stack removes top to reveal next.

                            // Modification: Let's simply assign a "visual index" relative to active.
                            let visualIndex = index - activeIndex;
                            if (visualIndex < 0) visualIndex += rooms.length; // cycle

                            // We only show top 3 cards properly?
                            // User request: "Rotate back parts to overlap like Figma".

                            let dataIndex = 'hidden';
                            if (visualIndex === 0) dataIndex = 0;
                            else if (visualIndex === 1) dataIndex = 1;
                            else if (visualIndex === 2) dataIndex = 2;
                            // else hidden

                            return (
                                <div
                                    key={room.roomId || index}
                                    className={styles.stackCard}
                                    data-index={dataIndex}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className={styles.cardHeader}>
                                        <div>
                                            {/* Room Name & Date fallback */}
                                            <h2 className={styles.tripTitle}>{room.name}</h2>
                                            {/* Mock Date if not present */}
                                            <div className={styles.tripDate}>
                                                {room.startDate || '일정 미정'}
                                            </div>
                                        </div>
                                        <button className={styles.viewAllBtn}>여행 전체보기 →</button>
                                    </div>

                                    <div className={styles.statusText}>
                                        <span className={styles.statusHighlight}>● 일정 생성중..</span><br />
                                        여행 구성원들과 대화를 더 나눠보세요.
                                    </div>

                                    {/* Trip Image - Use placeholder or room image if available */}
                                    <img src={tripImg} alt="Trip" className={styles.tripImage} />

                                    <button className={styles.enterBtn} onClick={(e) => enterRoom(e, room.roomId)}>
                                        '{room.name}' 여행톡방 가기
                                        <span>→</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dots / Pagination */}
                    <div className={styles.dots}>
                        {rooms.map((_, idx) => (
                            <div
                                key={idx}
                                className={`${styles.dot} ${idx === activeIndex ? styles.active : ''}`}
                                onClick={() => setActiveIndex(idx)}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Trip;
