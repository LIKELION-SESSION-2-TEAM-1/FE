import React from 'react';
import styles from './AuthChoice.module.css';
import logo from '../../assets/pic/TokPlan.png';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import kakao from '../../assets/oauth/카톡.png';
import naver from '../../assets/oauth/네이버.png';
import google from '../../assets/oauth/구글.png';
import StartButton from '../../components/Landing/StartButton';

const AuthChoice = () => {
    return (
        <div className={styles.container}>
            {/* 배경 패턴 및 로고 */}
            <BackgroundPattern />

            <img src={logo} alt="TokPlan Logo" className={styles.logo} />

            <div className={styles.contentWrapper}>
                {/* 로그인/회원가입 버튼 */}
                <div className={styles.buttonGroup}>
                    <StartButton
                        to="/login"
                        text="로그인"
                        style={{ width: '270px', height: '61px', justifyContent: 'space-between' }}
                        arrowStyle={{ width: '40px', height: '40px' }}
                    />
                    <StartButton
                        to="/signup"
                        text="회원가입"
                        style={{ width: '270px', height: '61px', justifyContent: 'space-between' }}
                        arrowStyle={{ width: '40px', height: '40px' }}
                    />
                </div>

                {/* 소셜 로그인 버튼 */}
                <div className={styles.socialGroup}>
                    <button className={styles.socialBtn} style={{ backgroundColor: '#FEE500' }}>
                        <img src={kakao} alt="Kakao" />
                    </button>
                    <button className={styles.socialBtn} style={{ backgroundColor: '#03C75A' }}>
                        <img src={naver} alt="Naver" />
                    </button>
                    <button className={styles.socialBtn} style={{ backgroundColor: '#FFFFFF' }}>
                        <img src={google} alt="Google" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthChoice;
