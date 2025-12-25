import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import styles from '../../pages/OnBoarding/Home/Home.module.css';

import arrow from "../../assets/pic/arrow.svg";
import search from "../../assets/pic/search.svg";

import { getProfile, updateProfile } from '../../apis/api';
import {
    getRecentSearches,
    addRecentSearch,
    deleteRecentSearch,
    deleteAllRecentSearches
} from '../../apis/storeSearchApi';

const SearchOverlay = ({ onClose }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isAutoSave, setIsAutoSave] = useState(true);

    // Initial Load: Fetch Profile (for setting) & Recent Searches
    useEffect(() => {
        const initData = async () => {
            try {
                // 1. Profile for AutoSave setting
                const profile = await getProfile();
                if (profile && typeof profile.recentSearchEnabled === 'boolean') {
                    setIsAutoSave(profile.recentSearchEnabled);
                }

                // 2. Recent Searches
                const data = await getRecentSearches();
                const list = Array.isArray(data) ? data : (data?.content || []);
                setRecentSearches(list);

            } catch (err) {
                console.error("Failed to load search data", err);
            }
        };
        initData();
    }, []);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;

        // Auto Save
        if (isAutoSave) {
            try {
                await addRecentSearch(term);
            } catch (err) {
                console.error("Failed to save recent search", err);
            }
        }

        navigate({
            pathname: '/search',
            search: `?${createSearchParams({ keyword: term })}`
        });
    };

    const handleRecentItemClick = (keyword) => {
        setSearchTerm(keyword);
        navigate({
            pathname: '/search',
            search: `?${createSearchParams({ keyword: keyword })}`
        });
    };

    const handleDeleteRecent = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteRecentSearch(id);
            setRecentSearches(prev => prev.filter(item => item.id !== id && item.recentSearchId !== id));
        } catch (err) {
            console.error("Failed to delete recent search", err);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllRecentSearches();
            setRecentSearches([]);
        } catch (err) {
            console.error("Failed to delete all", err);
        }
    };

    const handleToggleAutoSave = async () => {
        const newValue = !isAutoSave;
        setIsAutoSave(newValue);
        try {
            await updateProfile({ recentSearchEnabled: newValue });
        } catch (err) {
            console.error("Failed to update auto save setting", err);
            setIsAutoSave(!newValue);
        }
    };

    return (
        <div className={styles.searchOverlay}>
            <div className={styles.searchHeader}>
                <img
                    src={arrow}
                    alt="back"
                    className={styles.backButton_icon}
                    onClick={onClose}
                />
                <span className={styles.headerTitle}>TokPlan</span>
            </div>

            <form className={styles.searchBarFocused} onSubmit={handleSearchSubmit}>
                <button type="submit" className={styles.searchBar__iconButton} aria-label="여행지 검색">
                    <img src={search} alt="" className={styles.searchBar__icon} />
                </button>
                <input
                    className={styles.searchBar__input}
                    type="search"
                    placeholder='여행지 검색하기'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </form>

            <div className={styles.recentContainer}>
                <div className={styles.recentHeader}>
                    <span className={styles.recentTitle}>최근 검색</span>
                    <div className={styles.recentActions}>
                        <span className={styles.actionButton} onClick={handleDeleteAll}>전체삭제</span>
                        <span>|</span>
                        <span className={styles.actionButton} onClick={handleToggleAutoSave}>
                            {isAutoSave ? '자동저장 끄기' : '자동저장 켜기'}
                        </span>
                    </div>
                </div>

                {!isAutoSave ? (
                    <p className={styles.msgDisabled}>최근 검색 저장 기능이 꺼져 있습니다.</p>
                ) : (
                    <div className={styles.recentList}>
                        {recentSearches.length === 0 ? (
                            <p className={styles.msgDisabled} style={{ marginTop: '20px' }}>최근 검색어가 없습니다.</p>
                        ) : (
                            recentSearches.map((item, index) => (
                                <div key={item.id || item.recentSearchId || index} className={styles.recentItem} onClick={() => handleRecentItemClick(item.keyword)}>
                                    <span>{item.keyword}</span>
                                    <span
                                        className={styles.deleteItemBtn}
                                        onClick={(e) => handleDeleteRecent(e, item.id || item.recentSearchId)}
                                    >
                                        X
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;
