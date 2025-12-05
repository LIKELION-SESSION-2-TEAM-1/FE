import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.header}>
            <div className={styles.logo} onClick={() => navigate('/')}>TokPlan</div>
        </div>
    )
}

export default Header;