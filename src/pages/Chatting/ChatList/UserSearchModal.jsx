import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NewTravelSection.module.css';
import iconSearch from '../../../assets/pic/search.svg';
import imgCat1 from '../../../assets/pic/dogeja_cat1.png'; // Mock profile
import imgCat2 from '../../../assets/pic/dogeja_cat2.png'; // Mock profile

const MOCK_USERS = [
    { id: 'lion123', name: '변유민', img: imgCat1 },
    { id: 'lion1234444', name: '김예원', img: imgCat2 },
];

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UserSearchModal = ({ onClose }) => {
    const [searchText, setSearchText] = useState('lion123'); // Defaulting to match screenshot for demo

    // Simple filter
    const displayUsers = MOCK_USERS.filter(u =>
        u.id.includes(searchText) || u.name.includes(searchText)
    );

    const content = (
        <div className={styles.modalOverlay}>
            <div className={styles.modalSheet}>
                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>id로 여행톡에 추가하기</span>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="ID 검색"
                    />
                    <img src={iconSearch} alt="Search" className={styles.searchIcon} />
                </div>

                <div className={styles.resultList}>
                    {displayUsers.map(user => (
                        <div key={user.id} className={styles.userItem}>
                            <img src={user.img} alt={user.name} className={styles.userAvatar} />
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user.name}</div>
                                <div className={styles.userId}>{user.id}</div>
                            </div>
                            <button className={styles.addButton}>추가하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
};

export default UserSearchModal;
