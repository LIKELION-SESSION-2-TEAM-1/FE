import styles from './NavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';

import home from '../../assets/pic/home-home.svg';
import chat from '../../assets/pic/home-chat.svg';
import schedule from '../../assets/pic/home-schedule.svg';
import profile from '../../assets/pic/home-profile.svg';

const NavBar = () => {
    const { pathname } = useLocation();
    const path = pathname.toLowerCase();

    const isHomeActive = path === '/' || path === '/home';
    const isChatActive = path.startsWith('/chat');

    return (
        <div className={styles.navbar}>
        <div className={`${styles.wrapper} ${isHomeActive ? styles.wrapperHomePinned : ''}`}>
            <NavLink to="/" className={styles.item} aria-label="홈" end>
            <div className={`${styles.iconWrap} ${isHomeActive ? styles.iconWrapActive : ''}`}>
                {isHomeActive ? (
                <div className={styles.activeBox}>
                    <span className={styles.iconMask} style={{ '--icon-url': `url(${home})` }} aria-hidden="true" />
                    <span className={styles.activeLabel}>Home</span>
                </div>
                ) : (
                <img src={home} alt="Home" className={styles.icon} />
                )}
            </div>
            </NavLink>

            <NavLink to="/chat" className={styles.item} aria-label="채팅">
            <div className={`${styles.iconWrap} ${isChatActive ? styles.iconWrapActive : ''}`}>
                {isChatActive ? (
                <div className={styles.activeBox}>
                    <span className={styles.iconMask} style={{ '--icon-url': `url(${chat})` }} aria-hidden="true" />
                    <span className={styles.activeLabel}>Chat</span>
                </div>
                ) : (
                <img src={chat} alt="Chat" className={styles.icon} />
                )}
            </div>
            </NavLink>

            <img src={schedule} alt="Schedule" className={styles.icon} />
            <img src={profile} alt="Profile" className={styles.icon} />
        </div>
        </div>
    );
};

export default NavBar;