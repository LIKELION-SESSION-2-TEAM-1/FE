import React from 'react';
import styles from './NewTravelSection.module.css';
import TravelCalendar from '../../../components/Calendar/TravelCalendar';

const DateSelectionStep = ({
    selectedTab,
    setSelectedTab,
    startDate,
    endDate,
    selectedDates,
    onDateClick,
    onNext
}) => {
    const canProceed = selectedTab === 'date'
        ? (startDate && endDate)
        : (selectedDates.length > 0);

    return (
        <>
            <div className={styles.calendarCard}>
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${selectedTab === 'date' ? styles.active : ''}`}
                        onClick={() => setSelectedTab('date')}
                    >
                        날짜 지정
                    </button>
                    <button
                        className={`${styles.tab} ${selectedTab === 'flexible' ? styles.active : ''}`}
                        onClick={() => setSelectedTab('flexible')}
                    >
                        유연한 일정
                    </button>
                </div>

                <TravelCalendar
                    selectedTab={selectedTab}
                    startDate={startDate}
                    endDate={endDate}
                    selectedDates={selectedDates}
                    onDateClick={onDateClick}
                />
            </div>

            <div className={styles.styleCard} onClick={canProceed ? onNext : undefined}>
                <span className={styles.styleText}>이번 여행의 스타일을 알려주세요</span>
                <button className={styles.styleButton}>스타일 추가</button>
            </div>

            <button
                className={`${styles.nextButton} ${canProceed ? styles.nextButtonActive : ''}`}
                disabled={!canProceed}
                onClick={onNext}
            >
                다음
            </button>
        </>
    );
};

export default DateSelectionStep;
