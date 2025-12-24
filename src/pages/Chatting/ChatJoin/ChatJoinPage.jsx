import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { joinChatRoom } from '../../../apis/chatApi';
import styles from './ChatJoinPage.module.css'; // Optional simple styles

const ChatJoinPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState("초대 정보를 확인 중입니다...");

    useEffect(() => {
        const processJoin = async () => {
            const searchParams = new URLSearchParams(location.search);
            const roomId = searchParams.get('roomId');
            const code = searchParams.get('code');

            if (!roomId || !code) {
                setStatus("유효하지 않은 초대 링크입니다.");
                setTimeout(() => navigate('/home'), 2000);
                return;
            }

            try {
                // Call join API
                await joinChatRoom(roomId, code);
                setStatus("참여 완료! 채팅방으로 이동합니다.");

                // Navigate to chatroom with roomId
                setTimeout(() => {
                    navigate('/chatroom', { state: { roomId: roomId } });
                }, 1000);
            } catch (error) {
                console.error("Join failed:", error);

                // If error suggests already joined, just go to room
                // Check error message if possible, or assume success if it's a 409 Conflict (Already Member)
                // For now, let's treat generic error as failure but maybe try to enter anyway if it says "Already member"?
                // Backend spec doesn't say.

                if (error.response && error.response.status === 400) {
                    // Maybe invalid code
                    setStatus("초대 코드가 유효하지 않거나 만료되었습니다.");
                } else {
                    setStatus("채팅방 입장에 실패했습니다.");
                }

                setTimeout(() => navigate('/home'), 2000);
            }
        };

        processJoin();
    }, [location, navigate]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{status}</h2>
        </div>
    );
};

export default ChatJoinPage;
