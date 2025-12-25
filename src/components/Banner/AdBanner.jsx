import React from 'react';
import styles from './AdBanner.module.css';
import bannerImg from '../../assets/pic/sinan_salt.png';

const AdBanner = () => {
    return (
        <a
            className={styles.bannerCard}
            href="https://www.hyunhan.site"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className={styles.bannerText}>
                <p className={styles.bannerTitle}>신안 천일염 할인</p>
                <p className={styles.bannerSubtitle}>최대 30% 할인 (~12.31)</p>
                <p className={styles.bannerBrand}>SINAN SEA SALT</p>
            </div>
            <img className={styles.bannerImage} src={bannerImg} alt="신안 천일염 프로모션" />
        </a>
    );
};

export default AdBanner;
