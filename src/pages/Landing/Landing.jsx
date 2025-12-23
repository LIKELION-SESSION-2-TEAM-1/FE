import React from 'react';
import styles from './Landing.module.css';
import logo from '../../assets/pic/TokPlan.png';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import Snow from '../../components/Landing/Snow';
import StartButton from '../../components/Landing/StartButton';

const Landing = () => {
    return (
        <div className={styles.container}>
            <img src={logo} alt="TokPlan Logo" className={styles.logo} />

            <BackgroundPattern />
            <Snow />

            <div className={styles.buttonContainer}>
                <StartButton />
            </div>
        </div>
    );
};

export default Landing;
