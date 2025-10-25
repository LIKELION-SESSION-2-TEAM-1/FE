import styles from './Header.module.css';
import React from "react";

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>TokPlan</div>
        </div>
    )
}

export default Header;