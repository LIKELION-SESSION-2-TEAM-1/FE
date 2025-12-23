import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';

// Assets
import profileImg from '../../assets/pic/dogeja_cat1.png'; // Mock profile
import iconCamera from '../../assets/pic/채팅방/사진선택.png'; // Reusing camera icon

const MyPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Header / Back Button */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Profile Section */}
            <div className={styles.profileSection}>
                <div className={styles.profileImageWrapper}>
                    <img src={profileImg} alt="Profile" className={styles.profileImage} />
                    <img src={iconCamera} alt="Edit" className={styles.cameraBadge} />
                </div>
                <h2 className={styles.userName}>민수</h2>
                <span className={styles.editProfileLink}>수정</span>
            </div>

            <div className={styles.divider} />

            {/* Member Info Section */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>회원 정보</h3>
                <p className={styles.userId}>아이디: likelion12</p>

                <div className={styles.birthDateContainer}>
                    <span className={styles.fieldLabel}>생년월일</span>
                    <div className={styles.dateInputs}>
                        <div className={styles.dateBox}>2002</div>
                        <div className={styles.dateBox}>11</div>
                        <div className={styles.dateBox}>20</div>
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            {/* Travel Style Edit */}
            <div className={styles.menuItem} onClick={() => navigate('/mypage/edit-style')}>
                <div className={styles.menuContent}>
                    <h3 className={styles.menuTitle}>여행스타일 수정</h3>
                    <p className={styles.menuDesc}>더욱 맞춤화된 일정 추천을 경험해보세요!</p>
                </div>
                <span className={styles.chevron}>&gt;</span>
            </div>

            <div className={styles.divider} />

            {/* Map */}
            <div className={styles.menuItem}>
                <div className={styles.menuContent}>
                    <h3 className={styles.menuTitle}>지도</h3>
                    <p className={styles.menuDesc}>다녀온 여행지, 즐겨찾기</p>
                </div>
                {/* Implicit chevron or just description? Image cut off but likely link-like */}
                {/* <span className={styles.chevron}>&gt;</span> */}
            </div>

            {/* Delete Account */}
            <div className={styles.deleteAccountContainer}>
                <button className={styles.deleteAccountButton}>회원 탈퇴하기</button>
            </div>
        </div>
    );
};

export default MyPage;
