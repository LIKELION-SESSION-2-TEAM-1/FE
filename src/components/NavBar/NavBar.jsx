import styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import home from '../../assets/pic/home-home.svg';
import chat from '../../assets/pic/home-chat.svg';
import schedule from '../../assets/pic/home-schedule.svg';
import profile from '../../assets/pic/home-profile.svg';

const NavBar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.wrapper}>
                <NavLink to="/" className={styles.item} aria-label="홈">
                    <img src={home} alt="Home" className={styles.icon} />
                </NavLink>
                <img src={chat} alt="Home" className={styles.icon} />
                <img src={schedule} alt="Home" className={styles.icon} />
                <img src={profile} alt="Home" className={styles.icon} />
            </div>
        </div>
    )
}

export default NavBar;