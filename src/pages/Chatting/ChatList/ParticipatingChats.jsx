import React from 'react';
import styles from './ChatList.module.css';
import roomImg from '../../../assets/pic/chatlist_pic.png';
import searchIcon from '../../../assets/pic/search.svg';
import { useNavigate } from 'react-router-dom';

const ParticipatingChats = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.participatingContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>참여중인 여행톡</span>
                <img className={styles.searchIcon} src={searchIcon} alt="검색" />
            </div>

            <div
                className={styles.roomCard}
                role="button"
                tabIndex={0}
                onClick={() => navigate('/chatroom')}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/chatroom')}
            >
                <img className={styles.roomImage} src={roomImg} alt="부산 여행" />
                <div className={styles.roomContent}>
                    <div className={styles.roomTopRow}>
                        <span className={styles.roomTitle}>부산 여행</span>
                        <span className={styles.roomTime}>오전 09:15</span>
                    </div>
                    <div className={styles.roomMessageRow}>
                        <span className={styles.roomUnreadDot} aria-hidden />
                        <div className={styles.roomMessage}>
                            야들아 ai가 일정 짜줬다<br />1일차 얼른 확인ㅋㅋ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipatingChats;
