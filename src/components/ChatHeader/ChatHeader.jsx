import styles from './ChatHeader.module.css';
import arrow from "../../assets/pic/arrow2.svg";
import search from "../../assets/pic/search.svg";
import menu from "../../assets/pic/menu.svg";

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
                <img src={arrow} className={styles.arrow}/>
                <div className={styles.group}>
                    <span className={styles.groupName}>부산 여행</span>
                    <span className={styles.groupNum}>6</span>
                </div>
                <div className={styles.group2}>
                    <img src={search} className={styles.search}/>
                    <img src={menu} className={styles.menu}/>
                </div>
        </div>
    )
}

export default ChatHeader;