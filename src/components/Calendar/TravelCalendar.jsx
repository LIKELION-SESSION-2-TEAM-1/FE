import React, { useMemo } from 'react';
import styles from './TravelCalendar.module.css';

const TravelCalendar = ({ selectedTab, startDate, endDate, selectedDates, onDateClick }) => {
    // 현재 날짜 기준
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based

    // 이번 달의 첫 날과 마지막 날 계산
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // 이번 달 시작 요일 (0: 일, 1: 월, ... 6: 토)
    // 화면 디자인상 '월'요일부터 시작하므로 조정 필요
    // 일(0) -> 6, 월(1) -> 0 ...
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const days = ['월', '화', '수', '목', '금', '토', '일'];

    // 날짜 배열 생성 (빈 칸 포함)
    const calendarDays = useMemo(() => {
        const arr = [];
        // 앞쪽 빈 날짜 채우기
        for (let i = 0; i < startDayOfWeek; i++) {
            arr.push(null);
        }
        // 실제 날짜 채우기
        for (let i = 1; i <= totalDays; i++) {
            arr.push(new Date(currentYear, currentMonth, i));
        }
        return arr;
    }, [currentYear, currentMonth, startDayOfWeek, totalDays]);

    const getCellClass = (dateObj) => {
        if (!dateObj) return styles.emptyCell;

        const dateNum = dateObj.getDate();
        // 비교를 위해 timestamp 사용
        const time = dateObj.getTime();
        const start = startDate ? startDate.getTime() : null;
        const end = endDate ? endDate.getTime() : null;

        let classes = styles.dateCell;

        // 오늘 이전 날짜는 비활성화 (선택 사항)
        // if (time < new Date().setHours(0,0,0,0)) classes += ` ${styles.faded}`;

        if (selectedTab === 'date') {
            if (start && time === start) classes += ` ${styles.rangeStart}`;
            if (end && time === end) classes += ` ${styles.rangeEnd}`;
            if (start && end && time > start && time < end) {
                classes += ` ${styles.rangeBetween}`;
            }
        } else {
            // Multi selection check
            const isSelected = selectedDates.some(d => d.getTime() === time);
            if (isSelected) {
                classes += ` ${styles.multiSelected}`;
            }
        }
        return classes;
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.monthTitle}>
                {currentYear}년 {currentMonth + 1}월
            </div>
            <div className={styles.calendarGrid}>
                {days.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
                {calendarDays.map((dateObj, idx) => (
                    <div
                        key={idx}
                        className={getCellClass(dateObj)}
                        onClick={() => dateObj && onDateClick(dateObj)}
                        style={{ cursor: dateObj ? 'pointer' : 'default' }}
                    >
                        {dateObj ? dateObj.getDate() : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelCalendar;
