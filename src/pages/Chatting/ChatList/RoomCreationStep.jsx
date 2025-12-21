import React, { useState } from 'react';
import styles from './NewTravelSection.module.css';

// Assets from src/assets/pic/채팅방
import iconKakao from '../../../assets/pic/채팅방/카카오톡.png';
import iconLink from '../../../assets/pic/채팅방/링크초대.png';
import iconID from '../../../assets/pic/채팅방/ID로추가.png';
import iconCamera from '../../../assets/pic/채팅방/사진선택.png';

import UserSearchModal from './UserSearchModal';

const RoomCreationStep = ({
    roomName,
    setRoomName,
    onBack,
    onStartChat
}) => {
    const [image, setImage] = useState(null);
    const [showIdModal, setShowIdModal] = useState(false);

    // Placeholder image URL - using a generic travel-themed one or just a color if 'image' is null
    // The design shows a specific boat image. Since I don't have it, I'll use a color or a placeholder.
    // However, I'll allow the user to visualize "uploading" by clicking (mock).

    // Mock upload handler
    const handleImageUpload = () => {
        // In a real app, this would trigger a file picker
        // For now, let's just toggle a dummy state or do nothing visually other than the button exists
        console.log("Upload image clicked");
    };

    return (
        <>
            <div className={styles.creationCard}>
                {/* Profile Image Uploader */}
                <div className={styles.profileUploader} onClick={handleImageUpload}>
                    <div className={styles.imagePlaceholder}>
                        {image ? (
                            <img src={image} alt="Room" className={styles.uploadedImage} />
                        ) : (
                            // Default background if no image. design uses a boat image. 
                            // I'll stick to the CSS class I made .defaultImageBg
                            <div className={styles.defaultImageBg} />
                        )}
                    </div>
                    {/* Camera Badge - Using the PNG asset */}
                    <img src={iconCamera} alt="Upload" className={styles.cameraBadgeIcon} />
                </div>

                {/* Name Input */}
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        className={styles.roomNameInput}
                        placeholder="채팅방 이름"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        maxLength={20}
                    />
                    <span className={styles.charCount}>{roomName.length}/20</span>
                </div>

                <p className={styles.inviteText}>친구/가족들과 함께하는 그룹 채팅방을 만들어보세요.</p>

                {/* Invite Buttons Grid */}
                <div className={styles.inviteGrid}>
                    <button className={styles.inviteButton}>
                        <div className={styles.btnContent}>
                            <img src={iconKakao} alt="Kakao" className={styles.btnIcon} />
                            <span>카톡으로 초대</span>
                        </div>
                    </button>
                    <button className={styles.inviteButton}>
                        <div className={styles.btnContent}>
                            <img src={iconLink} alt="Link" className={styles.btnIcon} />
                            <span>링크로 초대</span>
                        </div>
                    </button>
                    <button
                        className={styles.inviteButton}
                        onClick={() => setShowIdModal(true)}
                    >
                        <div className={styles.btnContent}>
                            <img src={iconID} alt="ID" className={styles.btnIcon} />
                            <span>ID로 추가</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className={styles.bottomNav}>
                <button className={styles.backButton} onClick={onBack}>
                    이전
                </button>
                <button
                    className={`${styles.startButton} ${roomName.length > 0 ? styles.active : ''}`}
                    disabled={roomName.length === 0}
                    onClick={onStartChat}
                >
                    채팅 시작하기
                </button>
            </div>

            {/* ID Search Modal Overlay */}
            {showIdModal && (
                <UserSearchModal onClose={() => setShowIdModal(false)} />
            )}
        </>
    );
};

export default RoomCreationStep;
