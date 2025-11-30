import styles from './ChatList.module.css';
import bannerImg from '../../../assets/pic/sinan_salt.png';
import roomImg from '../../../assets/pic/chatlist_pic.png';
import searchIcon from '../../../assets/pic/search.svg';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.bannerCard}>
                <div className={styles.bannerText}>
                    <p className={styles.bannerTitle}>신안 천일염 할인</p>
                    <p className={styles.bannerSubtitle}>최대 30% 할인 (~12.31)</p>
                    <p className={styles.bannerBrand}>SINAN SEA SALT</p>
                </div>
                <img className={styles.bannerImage} src={bannerImg} alt="신안 천일염 프로모션" />
            </div>

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

            <div className={styles.newTravelSection}>
                <p className={styles.newTravelTitle}>새로운 여행톡을 시작해 보세요</p>
                <div className={styles.actionCard}>
                    <span className={styles.actionPrompt}>여행 날짜가 정해졌나요?</span>
                    <span className={styles.actionCTA}>날짜 추가</span>
                </div>
                <div className={styles.actionCard}>
                    <span className={styles.actionPrompt}>이번 여행의 스타일을 알려주세요</span>
                    <span className={styles.actionCTA}>스타일 추가</span>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
