import styles from './Chatting.module.css';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import send from "../../assets/pic/send.svg";

import { useState } from 'react';

const Chatting = () => {
    const [hasText, setHasText] = useState(false);

    const handleInput = (e) => {
        setHasText(e.target.value.trim().length > 0);
    };
    
    return (
        <div className={styles.chat__wrapper}>
            <div className={styles.chat__container}>
                <ChatHeader/>

                <div className={styles.message__wrapper}>
                    <div className={styles.composer}>
                        <textarea className={styles.input} placeholder="메세지를 입력하세요" rows={1} aria-label="메세지 입력" onInput={handleInput} />
                        <button type="button" className={`${styles.sendBtn} ${hasText ? styles.sendBtnActive : ''}`} aria-label="메세지 전송">
                            <img src={send} alt="" className={styles.sendIcon} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Chatting;