import React from 'react';
import styles from './Landing.module.css';
import logo from '../../assets/pic/TokPlan.png';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import StartButton from '../../components/Landing/StartButton';

const Landing = () => {
    return (
        <div className={styles.container}>
            <div className={styles.backgroundPattern}></div>
            <img src={logo} alt="TokPlan Logo" className={styles.logo} />

            <BackgroundPattern />

            <div className={styles.buttonContainer}>
                <StartButton />
            </div>
        </div>
    );
};

export default Landing;
