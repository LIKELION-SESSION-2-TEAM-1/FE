import React, { useRef, useEffect } from 'react';
import styles from './NewTravelSection.module.css';

// Images
import imgFood from '../../../assets/pic/관광지선택하는거모음집/관광보단먹방.png';
import imgActivity from '../../../assets/pic/관광지선택하는거모음집/체험엑티비티.png';
import imgCulture from '../../../assets/pic/관광지선택하는거모음집/문화예술역사.png';
import imgShopping from '../../../assets/pic/관광지선택하는거모음집/쇼핑은열정적으로.png';
import imgTour from '../../../assets/pic/관광지선택하는거모음집/유명관광지는필수.png';

import homeIndicator from '../../../assets/pic/Home Indicator.png';

const STYLE_OPTIONS = [
    { id: 'food', label: '관광보다 먹방', img: imgFood },
    { id: 'activity', label: '체험 / 액티비티', img: imgActivity },
    { id: 'culture', label: '문화 / 예술 / 역사', img: imgCulture },
    { id: 'shopping', label: '쇼핑은 열정적으로', img: imgShopping },
    { id: 'tour', label: '유명 관광지는 필수', img: imgTour },
];

const StyleSelectionStep = ({
    dateRangeText,
    selectedStyleId,
    setSelectedStyleId,
    onNext
}) => {
    const canProceed = !!selectedStyleId;
    const scrollContainerRef = useRef(null);
    const indicatorRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    // --- Scroll Sync Logic ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        const indicator = indicatorRef.current;
        if (!container || !indicator) return;

        const updateIndicator = () => {
            // If dragging, we update indicator manually to avoid lag/loop
            if (isDragging.current) return;

            const { scrollLeft, scrollWidth, clientWidth } = container;
            const scrollableWidth = scrollWidth - clientWidth;
            if (scrollableWidth <= 0) return;

            const progress = scrollLeft / scrollableWidth;

            // Calculate max travel for the indicator
            // Container Padding is 20px on sides inside styleSelectionCard (width 352). 
            // So inner width is approx 312px.
            // Indicator width is 134px.
            // Max travel = TrackWidth - IndicatorWidth.
            const trackWidth = container.clientWidth;
            const indicatorWidth = 134;
            const maxTranslate = trackWidth - indicatorWidth;

            // Center is 0 because of justify-content: center.
            // We want Left (progress 0) to be -maxTranslate/2
            // We want Right (progress 1) to be +maxTranslate/2
            const translate = (progress - 0.5) * maxTranslate;

            indicator.style.transform = `translateX(${translate}px)`;
        };

        container.addEventListener('scroll', updateIndicator);
        // Initial update
        updateIndicator();

        return () => container.removeEventListener('scroll', updateIndicator);
    }, []);

    // --- Drag Logic ---
    const handlePointerDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
        if (scrollContainerRef.current) {
            startScrollLeft.current = scrollContainerRef.current.scrollLeft;
        }
        e.target.setPointerCapture(e.pointerId);
        e.target.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const { scrollWidth, clientWidth } = container;
        const scrollableWidth = scrollWidth - clientWidth;
        const trackWidth = clientWidth;
        const indicatorWidth = 134;
        const maxTravel = trackWidth - indicatorWidth;

        const deltaX = e.clientX - startX.current;

        // Calculate how much we moved relative to the track's available visual space
        // deltaScroll / scrollableWidth = deltaX / maxTravel
        // deltaScroll = deltaX * (scrollableWidth / maxTravel)

        const deltaScroll = deltaX * (scrollableWidth / maxTravel);

        container.scrollLeft = startScrollLeft.current + deltaScroll;

        // Visually update thumb immediately for smoothness
        if (indicatorRef.current && scrollableWidth > 0) {
            const progress = container.scrollLeft / scrollableWidth;
            const translate = (progress - 0.5) * maxTravel;
            indicatorRef.current.style.transform = `translateX(${translate}px)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        e.target.style.cursor = 'grab';
    };

    return (
        <>
            <div className={styles.summaryCard}>
                <span>여행 날짜가 정해졌나요?</span>
                <span className={styles.summaryDate}>{dateRangeText}</span>
            </div>

            <div className={styles.styleSelectionCard}>
                <div className={styles.styleQuestion}>원하시는 이번 여행의 스타일이 있나요?</div>

                <div
                    className={styles.styleGrid}
                    ref={scrollContainerRef}
                >
                    {STYLE_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            className={styles.styleItem}
                            onClick={() => setSelectedStyleId(option.id)}
                        >
                            <img
                                src={option.img}
                                alt={option.label}
                                className={`${styles.styleImage} ${selectedStyleId === option.id ? styles.selected : ''}`}
                            />
                            <span className={styles.styleLabel}>{option.label}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.indicatorContainer}>
                    <img
                        src={homeIndicator}
                        alt=""
                        className={styles.homeIndicator}
                        ref={indicatorRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        // Add touch events fallback if pointer events are not fully supported or need preventing default
                        draggable="false"
                    />
                </div>
            </div>

            <button
                className={canProceed ? styles.nextButtonOrange : styles.nextButton}
                disabled={!canProceed}
                onClick={onNext}
            >
                다음
            </button>
        </>
    );
};

export default StyleSelectionStep;
