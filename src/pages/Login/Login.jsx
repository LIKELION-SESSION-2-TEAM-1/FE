import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './Login.module.css';
import useAuthStore from '../../stores/useAuthStore';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import arrow from '../../assets/pic/arrow.svg';
import { login, getProfile } from '../../apis/api';

import Loading from '../../components/Loading/Loading';
import Snow from '../../components/Landing/Snow';

import NeonLogin from '../../components/Login/NeonLogin';
import neonStyles from '../../components/Login/NeonLogin.module.css'; // For toggle switch style

const Login = () => {
    // ... existing hooks ...
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isNeonMode, setIsNeonMode] = useState(false);

    // ... useEffect for OAuth ...

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const performLogin = async (username, password) => {
        if (!username || !password) return;
        setIsLoading(true);
        try {
            const response = await login(username, password);
            const token = response.headers['authorization'] || response.headers['Authorization'];

            if (token) {
                useAuthStore.getState().login(token, username);
                localStorage.setItem('accessToken', token);
                navigate('/home');
            } else {
                alert('로그인에 실패했습니다. (서버 응답 오류)');
            }
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || '로그인에 실패했습니다.';
            alert(typeof message === 'string' ? message : '아이디와 비밀번호를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        performLogin(formData.username, formData.password);
    };

    const handleNeonLogin = (user, pass) => {
        performLogin(user, pass);
    };

    const isFormValid = formData.username.length > 0 && formData.password.length > 0;

    // Toggle Switch UI
    const ToggleSwitch = () => (
        <div
            className={`${neonStyles.toggleWrapper} ${isNeonMode ? neonStyles.active : ''}`}
            onClick={() => setIsNeonMode(!isNeonMode)}
            style={{ zIndex: 2000 }} // Ensure it stays on top
        >
            <div className={neonStyles.toggleLabel} style={{ color: isNeonMode ? '#fff' : '#333' }}>
                {isNeonMode ? 'NEON ON' : 'NEON OFF'}
            </div>
            <div className={neonStyles.toggleSwitch}></div>
        </div>
    );

    return (
        <div className={styles.container}>
            {isLoading && <Loading />}
            <ToggleSwitch />

            {isNeonMode ? (
                <NeonLogin
                    onLogin={handleNeonLogin}
                    onClose={() => setIsNeonMode(false)}
                />
            ) : (
                <>
                    <BackgroundPattern />
                    <Snow />

                    <h2 className={styles.title}>로그인</h2>

                    <div className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="username"
                                placeholder="아이디"
                                className={`${styles.inputField} ${formData.username ? styles.filled : ''}`}
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="비밀번호"
                                    className={`${styles.inputField} ${formData.password ? styles.filled : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    className={styles.eyeButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            className={`${styles.submitButton} ${isFormValid ? styles.active : ''}`}
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        >
                            로그인
                            <img src={arrow} alt="" className={styles.arrowIcon} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;
