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

    const handleConfirm = () => {
        if (searchResult) {
            onConfirm(searchResult.username || searchResult.userId || searchText); // Username (ID) 우선
            setSearchText('');
            setSearchResult(null);
        } else if (searchText) {
            // 검색 없이 강제 추가 (옵션)? 일단 검색 유도
            onConfirm(searchText);
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
                        placeholder="ID, 닉네임, 이메일 입력"
                    />
                    {/* 검색 아이콘 클릭 시 검색 */}
                    <img
                        src={iconSearch}
                        alt="Search"
                        className={styles.searchIcon}
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div style={{ padding: '0 20px 20px 20px' }}>

                    {/* 검색 결과 표시 영역 */}
                    {isSearching ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>검색 중...</p>
                    ) : searchResult ? (
                        <div className={styles.userItem} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                            {/* <img src={searchResult.profileImage || "default_img"} className={styles.userAvatar} /> */}
                            {/* 임시 아바타 */}
                            <div className={styles.userAvatar} style={{ backgroundColor: '#ccc' }} />
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{searchResult.displayName || searchResult.username || "알 수 없음"}</span>
                                <span className={styles.userId}>{searchResult.username}</span>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px', textAlign: 'center' }}>
                            {errorMsg || "입력한 정보와 일치하는 사용자를 검색합니다."}
                        </p>
                    )}

                    <button
                        className={styles.startButton}
                        onClick={handleConfirm}
                        disabled={!searchResult && !searchText} // 검색결과 없어도 텍스트 있으면 강제 추가 가능하게? 일단 허용
                        style={{ width: '100%', marginTop: '0' }}
                    >
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
};

export default UserSearchModal;
