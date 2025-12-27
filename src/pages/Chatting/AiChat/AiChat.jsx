import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AiChat.module.css';
import backIcon from "../../../assets/pic/arrow2.svg";
import sendIcon from "../../../assets/pic/send.svg";
import gfImage from '../../../assets/pic/여친/여친2.png';
import { sendAiGirlfriendMessage } from '../../../apis/aiApi';
import { getProfile } from '../../../apis/api';

const AI_NAMES = ['지수', '서연', '하린', '민지', '유민', '지우', '예은', '다인', '유진', '채원'];

const AiChat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [aiName, setAiName] = useState("여친");
    const [userName, setUserName] = useState("User");

    // Initialize Random Name and User Profile
    useEffect(() => {
        const initChat = async () => {
            // 1. Random AI Name
            const randomName = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
            setAiName(randomName);

            // 2. Fetch User Profile
            let myName = "자기"; // Default nickname if none found
            try {
                const profile = await getProfile();
                if (profile && (profile.nickname || profile.username)) {
                    myName = profile.nickname || profile.username;
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
            setUserName(myName);

            // 3. Set Initial Greeting
            setMessages([
                {
                    id: 'welcome',
                    text: `안녕 ${myName}? 나는 ${randomName}이야! 💖 오늘 기분 어때?`,
                    isMe: false,
                    timestamp: new Date()
                }
            ]);
        };

        initChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMsgText = inputText;
        const tempId = Date.now();

        // Add User Message
        const userMsg = {
            id: tempId,
            text: userMsgText,
            isMe: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsLoading(true);

        try {
            const response = await sendAiGirlfriendMessage(userMsgText);
            // response: { reply: "..." }
            const replyText = response.reply || "대답을 들을 수 없었어요 😢";

            const botMsg = {
                id: tempId + 1,
                text: replyText,
                isMe: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg = {
                id: tempId + 1,
                text: "음... 잠깐 머리가 아파요 🤕 다시 말해줄래?",
                isMe: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.screen}>
            {/* Header */}
            <header className={styles.topBar}>
                <button className={styles.navBtn} onClick={() => navigate(-1)} aria-label="back">
                    <img src={backIcon} alt="back" />
                </button>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>{aiName} 💖</h1>
                </div>
                <div style={{ width: 40 }}></div> {/* Spacer for alignment */}
            </header>

            {/* Messages */}
            <div className={styles.messageList}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.messageRow} ${msg.isMe ? styles.myRow : styles.otherRow}`}>
                        {!msg.isMe && (
                            <img src={gfImage} alt={aiName} className={styles.avatar} />
                        )}
                        <div className={styles.bubbleWrap}>
                            {!msg.isMe && <div className={styles.senderName}>{aiName}</div>}
                            <div className={`${styles.bubble} ${msg.isMe ? styles.myBubble : styles.otherBubble}`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className={`${styles.messageRow} ${styles.otherRow}`}>
                        <img src={gfImage} alt={aiName} className={styles.avatar} />
                        <div className={`${styles.bubble} ${styles.otherBubble}`}>
                            ...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputBar}>
                <input
                    className={styles.input}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`${aiName}에게 말을 걸어보세요...`}
                    disabled={isLoading}
                />
                <button
                    className={styles.sendBtn}
                    onClick={handleSend}
                    disabled={!inputText.trim() || isLoading}
                >
                    <img src={sendIcon} alt="Send" />
                </button>
            </div>
        </div>
    );
};

export default AiChat;
