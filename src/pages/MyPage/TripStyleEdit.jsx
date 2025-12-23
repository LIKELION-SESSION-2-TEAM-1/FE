import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TripStyleEdit.module.css';

const TripStyleEdit = () => {
    const navigate = useNavigate();

    // Mock State
    const [pace, setPace] = useState('느림'); // Single select
    const [rhythm, setRhythm] = useState('유연'); // Single select

    // Multi select arrays
    const [foodPrefs, setFoodPrefs] = useState(['고기']);
    const [constraints, setConstraints] = useState(['감자 양배추']);

    const toggleMultiSelect = (currentList, setList, item) => {
        if (currentList.includes(item)) {
            setList(currentList.filter(i => i !== item));
        } else {
            setList([...currentList, item]);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className={styles.pageTitle}>여행 스타일 입력</h1>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>
                    입력 정보를 기반으로 더욱 맞춤화된<br />
                    ai 여행 일정 추천이 가능합니다 !
                </p>

                {/* Pace Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>이동 페이스</span>
                        <span className={styles.sectionSubtitle}>최대 1개 선택 가능합니다.</span>
                    </div>
                    <div className={styles.optionGroup}>
                        {['느림', '보통', '빠름'].map(opt => (
                            <button
                                key={opt}
                                className={`${styles.optionPill} ${pace === opt ? styles.selected : ''}`}
                                onClick={() => setPace(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rhytm Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>하루 리듬</span>
                        <span className={styles.sectionSubtitle}>최대 1개 선택 가능합니다.</span>
                    </div>
                    <div className={styles.optionGroup}>
                        {['아침형', '유연', '야행성'].map(opt => (
                            <button
                                key={opt}
                                className={`${styles.optionPill} ${rhythm === opt ? styles.selected : ''}`}
                                onClick={() => setRhythm(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Food Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>음식 / 식성</span>
                    </div>

                    {/* Preferences */}
                    <div>
                        <div className={styles.subLabel}>취향</div>
                        <div className={styles.optionGroup}>
                            {['해산물', '고기', '양식', '한식'].map(opt => (
                                <button
                                    key={opt}
                                    className={`${styles.optionPill} ${foodPrefs.includes(opt) ? styles.selected : ''}`}
                                    onClick={() => toggleMultiSelect(foodPrefs, setFoodPrefs, opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Constraints */}
                    <div style={{ marginTop: '16px' }}>
                        <div className={styles.subLabel}>제약 (알레르기 등)</div>
                        <div className={styles.optionGroup}>
                            {['감자 양배추', '해당 없음', '고기', '해산물'].map(opt => (
                                <button
                                    key={opt}
                                    className={`${styles.optionPill} ${constraints.includes(opt) ? styles.selected : ''}`}
                                    onClick={() => toggleMultiSelect(constraints, setConstraints, opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className={styles.footerNote}>*직접 입력 칸에는 가짓수 상관없이 자유롭게 작성 가능합니다.</p>
                </div>
            </div>

            {/* Submit Button */}
            <div className={styles.submitButtonContainer}>
                <button className={styles.submitButton} onClick={() => navigate(-1)}>
                    수정하기
                    {/* Recreating the long thin arrow from the image using SVG */}
                    <svg width="50" height="24" viewBox="0 0 50 24" fill="none" className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12H49" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M43 6L49 12L43 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TripStyleEdit;
