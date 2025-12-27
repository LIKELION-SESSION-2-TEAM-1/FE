import React, { useState } from 'react';
import styles from './ChatList.module.css';
import { useNavigate } from 'react-router-dom';
import AdBanner from '../../../components/Banner/AdBanner';
import NewTravelSection from './NewTravelSection';
import ParticipatingChats from './ParticipatingChats';
import AiGirlfriendBanner from './AiGirlfriendBanner';

const ChatList = () => {
    // const navigate = useNavigate();
    const [isWizardActive, setIsWizardActive] = useState(false);

    return (
        <div className={styles.page}>
            <AdBanner />
            <AiGirlfriendBanner />

            {/* 
               참여중인 여행톡은 나중에 사용하기 위해 ParticipatingChats 컴포넌트로 분리하고
               현재 화면에서는 숨김 처리함.
            */}
            {!isWizardActive && <ParticipatingChats />}

            <NewTravelSection onWizardStateChange={setIsWizardActive} />
        </div>
    );
};

export default ChatList;
