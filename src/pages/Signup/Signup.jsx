import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './Signup.module.css';
import BackgroundPattern from '../../components/Landing/BackgroundPattern';
import arrow from '../../assets/pic/arrow.svg';
import { signup } from '../../apis/api';

import Loading from '../../components/Loading/Loading';

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isValid, setIsValid] = useState(false);

    const validateForm = (data) => {
        const { username, password, passwordConfirm } = data;

        // ID validation: Simple length check to allow emails
        const isUsernameValid = username.length >= 4;

        // Password validation: Simple length check for easier testing
        // const hasUpperCase = /[A-Z]/.test(password);
        // const hasLowerCase = /[a-z]/.test(password);
        // const hasNumber = /[0-9]/.test(password);
        // const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        // const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

        const isPasswordValid = password.length >= 4;

        // Password Confirm validation
        const isConfirmValid = password === passwordConfirm && passwordConfirm.length > 0;

        return isUsernameValid && isPasswordValid && isConfirmValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            setIsValid(validateForm(newData));
            return newData;
        });
    };

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsLoading(true);
        try {
            // passwordConfirm is for client-side validation only
            await signup(formData.username, formData.password);
            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                const message = error.response.data.message || error.response.data;
                alert(`회원가입 실패: ${typeof message === 'string' ? message : '입력 정보를 확인해주세요.'}`);
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {isLoading && <Loading />}
            <BackgroundPattern />


            <h2 className={styles.title}>회원가입</h2>

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

                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="passwordConfirm"
                            placeholder="비밀번호 확인"
                            className={`${styles.inputField} ${formData.passwordConfirm ? styles.filled : ''}`}
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                        />
                        <button
                            className={styles.eyeButton}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            type="button"
                        >
                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>

                </div>

                <button
                    className={`${styles.submitButton} ${isValid ? styles.active : ''}`}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    회원가입
                    <img src={arrow} alt="" className={styles.arrowIcon} />
                </button>
            </div>
        </div>
    );
};

export default Signup;
