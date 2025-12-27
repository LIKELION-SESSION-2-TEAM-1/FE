import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AiGirlfriendBanner.module.css';
import gfImage from '../../../assets/pic/여친/여친1.png';

const AiGirlfriendBanner = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bannerContainer} onClick={() => navigate('/ai-chat')}>
            <div className={styles.textContainer}>
                <span className={styles.adBadge}>AD</span>
                <h3 className={styles.title}>AI 여친이 기다리고 있어요</h3>
                <p className={styles.subtitle}>
                    혹시 여행을 같이 갈 친구가 없다면??<br />
                    AI 여친과 함께 여행가는 기분을 느껴보세요!
                </p>
            </div>
            <img src={gfImage} alt="AI 여친" className={styles.image} />
        </div>
    );
};

export default AiGirlfriendBanner;
