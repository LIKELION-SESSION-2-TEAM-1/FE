import styles from './NavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';

import home from '../../assets/pic/home-home.svg';
import chat from '../../assets/pic/home-chat.svg';
import schedule from '../../assets/pic/home-schedule.svg';
import profile from '../../assets/pic/home-profile.svg';

const MaskIcon = ({ src, alt, className }) => (
    <span role="img" aria-label={alt} className={`${styles.icon} ${className || ''}`} style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }} />
);

const NavBar = () => {
    const { pathname } = useLocation();
    const isHome = pathname === '/' || pathname.startsWith('/home');
    const isChat = pathname.startsWith('/chat');
    const isTrip = pathname.startsWith('/trip');
    const isMyPage = pathname.startsWith('/mypage');

    return (
        <div className={styles.navbar}>
            <div className={`${styles.wrapper} ${isChat ? styles.chatBackground : ''}`}>
                <NavLink to="/" className={styles.link}>
                    <div className={`${styles.icon_box} ${isHome ? styles.active : ''}`}>
                        <MaskIcon src={home} alt="Home" />
                        <span className={styles.icon_text}>Home</span>
                    </div>
                </NavLink>
                <NavLink to="/chatlist" className={styles.link}>
                    <div className={`${styles.icon_box} ${isChat ? styles.active : ''}`}>
                        <MaskIcon src={chat} alt="Chat" />
                        <span className={styles.icon_text}>Chat</span>
                    </div>
                </NavLink>
                <NavLink to="/trip" className={styles.link}>
                    <div className={`${styles.icon_box} ${isTrip ? styles.active : ''}`}>
                        <MaskIcon src={schedule} alt="Trip" />
                        <span className={styles.icon_text}>Trip</span>
                    </div>
                </NavLink>
                <NavLink to="/mypage" className={styles.link}>
                    <div className={`${styles.icon_box} ${isMyPage ? styles.active : ''}`}>
                        <MaskIcon src={profile} alt="Profile" />
                        <span className={styles.icon_text}>MyPage</span>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default NavBar;
