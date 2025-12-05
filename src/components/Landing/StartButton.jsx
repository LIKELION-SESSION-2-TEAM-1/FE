import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './StartButton.module.css';
import arrow from '../../assets/pic/arrow.svg';

const StartButton = () => {
    return (
        <NavLink to="/home" className={styles.startButton}>
            톡플랜과 여행 시작하기
            <span><img src={arrow} alt="" className={styles.arrowIcon} /></span>
        </NavLink>
    );
};

export default StartButton;
