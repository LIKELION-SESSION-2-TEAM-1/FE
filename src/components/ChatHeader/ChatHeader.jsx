import styles from './ChatHeader.module.css';
import arrow from "../../assets/pic/arrow2.png";
import search from "../../assets/pic/search.png";
import menu from "../../assets/pic/menu.png";

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
                <img src={arrow} className={styles.arrow}/>
                <p className={styles.groupName}>부산 여행</p>
                <p className={styles.groupNum}>6</p>
                <img src={search} className={styles.search}/>
                <img src={menu} className={styles.menu}/>
        </div>
    )
}

export default ChatHeader;