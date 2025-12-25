import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, createSearchParams } from 'react-router-dom';
import styles from './Home.module.css';

import pic from "../../../assets/pic/pic1.png";
import arrow from "../../../assets/pic/arrow.svg";
import search from "../../../assets/pic/search.svg";
import trip from "../../../assets/pic/trip.svg";
import pic2 from "../../../assets/pic/pic2.png";
import pic3 from "../../../assets/pic/pic3.png";
import arrow3 from "../../../assets/pic/arrow3.svg";

import ReccoDetail from "../../../components/Home/ReccoDetail";
import PopularDetail from "../../../components/Home/PopularDetail";

import { getProfile, updateProfile } from '../../../apis/api';
import {
    getRecentSearches,
    addRecentSearch,
    deleteRecentSearch,
    deleteAllRecentSearches
} from '../../../apis/storeSearchApi';

const Home = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // UI State
    const [isReccoExpanded, setIsReccoExpanded] = useState(false);
    const [isPopularExpanded, setIsPopularExpanded] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // Data State (Recent Search)
    const [recentSearches, setRecentSearches] = useState([]);
    const [isAutoSave, setIsAutoSave] = useState(true);

    // Initial Load: Get Profile for AutoSave setting
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                // If profile has recentSearchEnabled, use it. Default true.
                if (profile && typeof profile.recentSearchEnabled === 'boolean') {
                    setIsAutoSave(profile.recentSearchEnabled);
                }
            } catch (err) {
                console.error("Failed to fetch profile settings", err);
            }
        };
        fetchProfile();
    }, []);

    // Load Recent Searches when entering Search Mode
    useEffect(() => {
        if (isSearchMode) {
            fetchRecentSearches();
        }
    }, [isSearchMode]);

    const fetchRecentSearches = async () => {
        try {
            const data = await getRecentSearches();
            // Data format check: data might be array or boxed
            const list = Array.isArray(data) ? data : (data?.content || []);
            setRecentSearches(list);
        } catch (err) {
            console.error("Failed to load recent searches", err);
        }
    };

    const handleReccoToggle = () => setIsReccoExpanded(prev => !prev);
    const handleDetailClose = () => setIsReccoExpanded(false);
    const handlePopularToggle = () => setIsPopularExpanded(prev => !prev);
    const handlePopularClose = () => setIsPopularExpanded(false);

    // Search Mode Handlers
    const openSearchMode = () => setIsSearchMode(true);
    const closeSearchMode = () => setIsSearchMode(false);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;

        // Auto Save (Optimistic or await)
        if (isAutoSave) {
            try {
                await addRecentSearch(term);
                // No need to re-fetch if we are navigating away immediately
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
        // Clicking a recent item runs the search
        setSearchTerm(keyword);
        navigate({
            pathname: '/search',
            search: `?${createSearchParams({ keyword: keyword })}`
        });
    };

    const handleDeleteRecent = async (e, id) => {
        e.stopPropagation(); // prevent triggering item click
        try {
            await deleteRecentSearch(id);
            setRecentSearches(prev => prev.filter(item => item.id !== id && item.recentSearchId !== id)); // Handle potential ID field diffs
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
            // Revert on error
            setIsAutoSave(!newValue);
        }
    };

    return (
        <div className={styles.main__wrapper}>
            <div className={styles.main__container}>

                {/* Regular Home View */}
                {!isSearchMode && (
                    <div className={styles.main__card}>
                        <div className={styles.card__text}>
                            <p className={styles.card__text1}>막막했던 여행,<br />대화로 시작하세요.</p>
                            <p className={styles.card__text2}>친구들을 초대해서 대화만으로 계획을 완성하세요.</p>
                        </div>
                        <img src={pic} alt="" className={styles.card__pic} />

                        <NavLink to='/chatlist' className={styles.item}>
                            <div className={styles.card__button}>
                                <p className={styles.card__text3}>새로운 여행계획 시작하기</p>
                                <img src={arrow} alt="" className={styles.card__arrow} />
                            </div>
                        </NavLink>

                        {/* Search Bar - Activates Search Mode */}
                        <div className={styles.searchBar} onClick={openSearchMode}>
                            <button type="button" className={styles.searchBar__iconButton} aria-label="여행지 검색">
                                <img src={search} alt="" className={styles.searchBar__icon} />
                            </button>
                            <input
                                className={styles.searchBar__input}
                                type="text"
                                placeholder='여행지 검색하기'
                                value={searchTerm}
                                readOnly
                            // Prevent typing in this view, force mode switch
                            />
                        </div>

                        {isReccoExpanded ? (
                            <ReccoDetail className={styles.detailClass} onClose={handleDetailClose} />
                        ) : (
                            <div className={styles.cardsContainer}>
                                <div className={styles.recco} onClick={handleReccoToggle}>
                                    <p className={styles.recco__text}>맞춤<br />여행지<br />추천</p>
                                    <img src={trip} alt="" className={styles.recco__img} />
                                </div>

                                <div className={styles.cards}>
                                    <div className={styles.style}>
                                        <p className={styles.style__text}>여행 스타일<br />설정하기</p>
                                    </div>
                                    <img src={pic2} alt="" className={styles.pic2} />
                                </div>
                            </div>
                        )}

                        {isPopularExpanded ? (
                            <PopularDetail onClose={handlePopularClose} />
                        ) : (
                            <div className={styles.popular}>
                                <img src={pic3} className={styles.pic3} alt="popular travel" />
                                <p className={styles.popular__text}>이번주 인기 여행지</p>
                                <div className={styles.popular__button} onClick={handlePopularToggle}>
                                    <img src={arrow3} alt="" className={styles.popular__arrow} />
                                </div>
                            </div>
                        )}

                        <div>
                            <p className={styles.copyright}>Copyright © 2025 tokplan<br />
                                All rights reserved.</p>
                        </div>
                    </div>
                )}

                {/* Search Mode View */}
                {isSearchMode && (
                    <div className={styles.searchOverlay}>
                        <div className={styles.searchHeader}>
                            <img
                                src={arrow}
                                alt="back"
                                className={styles.backButton_icon}
                                onClick={closeSearchMode}
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
                )}

            </div>
        </div>
    )
}

export default Home;