import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NeonLogin.module.css';

const NeonLogin = ({ onLogin, onClose }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.light}></div>
                <h2 className={styles.title}>Login</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Login
                    </button>

                    <div className={styles.registerLink}>
                        Don't have an account?
                        <span
                            onClick={() => navigate('/signup')}
                            style={{ cursor: 'pointer', color: '#00f3ff', fontWeight: 'bold', marginLeft: '5px' }}
                        >
                            Register
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NeonLogin;
