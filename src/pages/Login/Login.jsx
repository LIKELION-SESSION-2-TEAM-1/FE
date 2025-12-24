import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './Login.module.css';
import useAuthStore from '../../stores/useAuthStore';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import arrow from '../../assets/pic/arrow.svg';
import { login } from '../../apis/api';

import Loading from '../../components/Loading/Loading';
import Snow from '../../components/Landing/Snow';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To parse query params for OAuth
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // OAuth Redirect Handling
    // Google/Kakao login redirects to: /login?token=<pure_jwt>
    useEffect(() => {
        // If another page redirected here due to missing token, surface debug info.
        try {
            const raw = sessionStorage.getItem('auth_debug');
            if (raw) {
                console.warn('Auth debug (from redirect):', JSON.parse(raw));
                sessionStorage.removeItem('auth_debug');
            }
        } catch {
            // ignore
        }

        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            console.log("OAuth Token found in URL:", tokenFromUrl);
            // User instruction: OAuth token is pure JWT, so we must add 'Bearer ' prefix when saving.
            const accessToken = `Bearer ${tokenFromUrl}`;

            localStorage.setItem('accessToken', accessToken);
            useAuthStore.getState().login(accessToken, 'Social User'); // We might not have username yet

            // Navigate to home to clear URL params
            navigate('/home', { replace: true });
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.password) return;

        setIsLoading(true);
        try {
            const response = await login(formData.username, formData.password);

            console.log('Login Response:', response);
            console.log('Response Headers:', response.headers);

            const token = response.headers['authorization'] || response.headers['Authorization'];

            if (token) {
                // [Zustand] 스토어에 로그인 정보 저장 (localStorage 처리는 store 내부 또는 persist 미들웨어가 담당)
                // username도 함께 저장하고 싶다면 인자로 전달
                useAuthStore.getState().login(token, formData.username);

                // 기존 수동 localStorage 저장은 제거해도 되지만, 
                // persist 미들웨어를 안 쓴 다른 로직과의 호환성을 위해 남겨둘 수도 있음.
                // 여기서는 깔끔하게 제거하고 store에 맡기는 것을 추천하거나, 
                // 이미 다른 코드들이 localStorage.getItem('accessToken')을 쓰고 있다면 호환성을 위해 남겨둠.
                localStorage.setItem('accessToken', token);

                navigate('/home');
            } else {
                console.warn('Token missing in response headers');
                alert('로그인에 실패했습니다. (서버 응답 오류)');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                const message = error.response.data.message || error.response.data;
                alert(`로그인 실패: ${typeof message === 'string' ? message : '아이디와 비밀번호를 확인해주세요.'}`);
            } else {
                alert('로그인에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.username.length > 0 && formData.password.length > 0;

    return (
        <div className={styles.container}>
            {isLoading && <Loading />}
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
        </div>
    );
};

export default Login;
