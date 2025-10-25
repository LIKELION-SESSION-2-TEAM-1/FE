import styles from './Chatting.module.css';
import ChatHeader from '../../components/ChatHeader/ChatHeader';

const Chatting = () => {
    return (
        <div className={styles.chat__wrapper}>
            <div className={styles.chat__container}>
                <ChatHeader/>
            </div>
        </div>
    )
}

export default Chatting;