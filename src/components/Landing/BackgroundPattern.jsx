import React from 'react';
import styles from './BackgroundPattern.module.css';
import icon from '../../assets/pic/Frame 37.png';

export default function BackgroundPattern() {
    return (
        <div className={styles.wrapper}>
            <div className={`${styles.line} ${styles.line1}`}>
                <img src={icon} alt="" className={styles.icon} />
            </div>

            <div className={`${styles.line} ${styles.line2}`}>
                <img src={icon} alt="" className={`${styles.icon} ${styles.line2Img1}`} />
                <img src={icon} alt="" className={`${styles.icon} ${styles.line2Img2}`} />
            </div>

            <div className={`${styles.line} ${styles.line3}`}>
                <img src={icon} alt="" className={styles.icon} />
            </div>
        </div>
    );
}
