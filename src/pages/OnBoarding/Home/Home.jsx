import styles from './Home.module.css';
import pic from "../../../assets/pic/pic1.png";
import arrow from "../../../assets/pic/arrow.svg";
import { NavLink, useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import search from "../../../assets/pic/search.svg";
import trip from "../../../assets/pic/trip.svg";
import pic2 from "../../../assets/pic/pic2.png";
import pic3 from "../../../assets/pic/pic3.png";
import arrow3 from "../../../assets/pic/arrow3.svg";
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../stores/useAuthStore';
import ReccoDetail from "../../../components/Home/ReccoDetail";
import PopularDetail from "../../../components/Home/PopularDetail";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isReccoExpanded, setIsReccoExpanded] = useState(false);
    const [isPopularExpanded, setIsPopularExpanded] = useState(false);



    const handleReccoToggle = () => {
        setIsReccoExpanded(prev => !prev);
    };

    const handleDetailClose = () => {
        setIsReccoExpanded(false);
    };

    const handlePopularToggle = () => {
        setIsPopularExpanded(prev => !prev);
    };

    const handlePopularClose = () => {
        setIsPopularExpanded(false);
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;

        // [수정] createSearchParams를 사용하여 인코딩 및 URL 생성 안전성 확보
        navigate({
            pathname: '/search',
            search: `?${createSearchParams({ keyword: term })}`
        });
    };

    return (
        <div className={styles.main__wrapper}>
            <div className={styles.main__container}>
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

                    <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
                        <button type="submit" className={styles.searchBar__iconButton} aria-label="여행지 검색">
                            <img src={search} alt="" className={styles.searchBar__icon} />
                        </button>
                        <input
                            className={styles.searchBar__input}
                            type="search"
                            placeholder='여행지 검색하기'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </form>

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
            </div>
        </div>
    )
}

export default Home;