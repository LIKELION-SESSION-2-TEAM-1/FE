import styles from './ChatHeader.module.css';
import arrow from "../../assets/pic/arrow2.svg";
import search from "../../assets/pic/search.svg";
import menu from "../../assets/pic/menu.svg";

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
                <img src={arrow} alt="뒤로가기" className={styles.arrow}/>
                <div className={styles.group}>
                    <span className={styles.groupName}>부산 여행</span>
                    <span className={styles.groupNum}>6</span>
                </div>
                <div className={styles.group2}>
                    <img src={search} alt="검색" className={styles.search}/>
                    <img src={menu} alt="메뉴" className={styles.menu}/>
                </div>
        </div>
    )
}

export default ChatHeader;