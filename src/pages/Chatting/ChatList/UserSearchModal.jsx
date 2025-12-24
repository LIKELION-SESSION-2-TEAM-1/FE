import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NewTravelSection.module.css';
import iconSearch from '../../../assets/pic/search.svg';
import { searchUser } from '../../../apis/chatApi';

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UserSearchModal = ({ onClose, onConfirm }) => {
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState(null); // { id, name, profileImage, ... }
    const [isSearching, setIsSearching] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setIsSearching(true);
        setErrorMsg('');
        setSearchResult(null);

        try {
            // API 호출: searchUser(identifier)
            // Response: { userId, displayName, username }
            const result = await searchUser(searchText.trim());

            if (result && result.userId) {
                setSearchResult(result);
            } else {
                setErrorMsg("사용자를 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error(err);
            // 404 handled here usually
            setErrorMsg("사용자를 찾을 수 없습니다.");
        } finally {
            setIsSearching(false);
        }
    };


    // Enter key to search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const content = (
        <div className={styles.modalOverlay}>
            <div className={styles.modalSheet}>
                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>ID/닉네임으로 추가</span>
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
                        onKeyDown={handleKeyDown}
                        placeholder="ID를 입력하세요"
                    />
                    <img
                        src={iconSearch}
                        alt="Search"
                        className={styles.searchIcon}
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className={styles.resultList}>
                    {isSearching ? (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>검색 중...</p>
                    ) : searchResult ? (
                        <div className={styles.userItem}>
                            {/* 임시 아바타 (이미지 있으면 src 사용) */}
                            <div className={styles.userAvatar} />
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{searchResult.displayName || "알 수 없음"}</span>
                                <span className={styles.userId}>{searchResult.username || searchResult.userId}</span>
                            </div>
                            <button
                                className={styles.addButton}
                                onClick={() => onConfirm(searchResult.username || searchResult.userId)}
                            >
                                추가하기
                            </button>
                        </div>
                    ) : (
                        <p style={{ fontSize: '13px', color: '#999', marginTop: '40px', textAlign: 'center' }}>
                            {errorMsg || "ID를 검색하여 친구를 추가해보세요."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
};

export default UserSearchModal;
