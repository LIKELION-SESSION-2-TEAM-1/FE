import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './StartButton.module.css';
import arrow from '../../assets/pic/arrow.svg';

const StartButton = ({ to = "/login", text = "톡플랜과 여행 시작하기", style, className, arrowStyle }) => {
    return (
        <NavLink to={to} className={`${styles.startButton} ${className || ''}`} style={style}>
            {text}
            <span><img src={arrow} alt="" className={styles.arrowIcon} style={arrowStyle} /></span>
        </NavLink>
    );
};

export default StartButton;
