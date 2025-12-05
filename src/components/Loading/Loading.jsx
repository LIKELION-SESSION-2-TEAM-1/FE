import React from 'react';
import styles from './Loading.module.css';
import logo from '../../assets/pic/TokPlan.png';

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.content}>
                <img src={logo} alt="TokPlan" className={styles.logo} />
                <div className={styles.spinner}></div>
                <p className={styles.text}>잠시만 기다려주세요...</p>
            </div>
        </div>
    );
};

export default Loading;
