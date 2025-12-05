import React, { useEffect, useRef, useState } from 'react';
import styles from './Dogeja.module.css';
import cat1 from '../../assets/pic/dogeja_cat1.png';
import cat2 from '../../assets/pic/dogeja_cat2.png';

const Dogeja = () => {
    const [imageSrc, setImageSrc] = useState(cat1);
    const [isBowing, setIsBowing] = useState(false);
    const [isRapid, setIsRapid] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleBowToggle = () => {
        if (isRapid) return; // 격한 사죄 중에는 단일 토글 무시
        if (isBowing) {
            setImageSrc(cat1);
            setIsBowing(false);
        } else {
            setImageSrc(cat2);
            setIsBowing(true);
        }
    };

    const handleRapidToggle = () => {
        if (isRapid) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setImageSrc(cat1);
            setIsRapid(false);
            setIsBowing(false);
            return;
        }

        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRapid(true);
        setIsBowing(false);
        setImageSrc(cat2);
        intervalRef.current = setInterval(() => {
            setImageSrc((prev) => (prev === cat1 ? cat2 : cat1));
        }, 83); // 1초에 12번 전환
    };

    return (
        <div className={styles.screen}>
            <div className={styles.card}>
                <img className={styles.image} src={imageSrc} alt="dogeja cat" />
                <div className={styles.buttons}>
                    <button className={styles.button} onClick={handleBowToggle} disabled={isRapid}>
                        {isBowing ? '일어나기' : '사죄'}
                    </button>
                    <button className={`${styles.button} ${styles.strong}`} onClick={handleRapidToggle}>
                        {isRapid ? '멈추기' : '격한 사죄'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dogeja;
