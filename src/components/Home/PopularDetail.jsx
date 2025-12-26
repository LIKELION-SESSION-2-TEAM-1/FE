import React, { useEffect, useState } from "react";
import styles from './PopularDetail.module.css';
import pic3 from "../../assets/pic/pic3.png";
import arrow5 from "../../assets/pic/arrow5.svg";
import { getWeeklyRanking } from "../../apis/storeSearchApi";
import useDataStore from "../../stores/useDataStore";

const PopularDetail = ({ className, onClose }) => {
    // Global Cache Store
    const { weeklyRanking, rankingLastFetched, setWeeklyRanking } = useDataStore();
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        // 1. Date Formatting
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Calculate week of month
        const getWeekOfMonth = (date) => {
            const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
            const dateStr = date.getDate();
            return Math.ceil((dateStr + dayOfWeek) / 7);
        };

        const weekMap = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];
        const weekIndex = getWeekOfMonth(now) - 1;
        const weekLabel = weekMap[weekIndex] || '마지막';

        setCurrentDate(`${year}.${month}월 ${weekLabel}주`);

        // 2. Fetch Ranking with Caching Strategy
        const fetchRanking = async () => {
            // Cache valid for 10 minutes
            const CACHE_DURATION = 10 * 60 * 1000;
            const isCacheValid = weeklyRanking && rankingLastFetched && (Date.now() - rankingLastFetched < CACHE_DURATION);

            if (isCacheValid) {
                console.log("Using cached ranking data");
                return;
            }

            try {
                console.log("Fetching new ranking data...");
                const data = await getWeeklyRanking();
                if (Array.isArray(data)) {
                    setWeeklyRanking(data.slice(0, 6)); // Store Top 6
                }
            } catch (error) {
                console.error("Failed to fetch ranking:", error);
            }
        };
        fetchRanking();
    }, [weeklyRanking, rankingLastFetched, setWeeklyRanking]);

    // Use cached data for display
    const safeRanking = weeklyRanking || [];
    const leftColumn = safeRanking.slice(0, 3);
    const rightColumn = safeRanking.slice(3, 6);

    return (
        <div className={styles.popularDetail}>
            <img src={arrow5} onClick={onClose} className={styles.arrow} alt="close" />
            <div className={styles.box}>
                <p className={styles.text1}>이번주 인기 여행지</p>
                <p className={styles.date}>{currentDate}</p>
            </div>
            <img src={pic3} className={styles.pic} alt="popular travel" />
            <p className={styles.rank}>랭킹</p>
            <div className={styles.textBox}>
                <div style={{ flex: 1 }}>
                    {leftColumn.map((item, index) => (
                        <p key={item.ranking || index}>{index + 1}. {item.region}</p>
                    ))}
                    {leftColumn.length === 0 && <p>데이터를 불러오는 중...</p>}
                </div>
                <div style={{ flex: 1, paddingLeft: '10px' }}>
                    {rightColumn.map((item, index) => (
                        <p key={item.ranking || index}>{index + 4}. {item.region}</p>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default PopularDetail;