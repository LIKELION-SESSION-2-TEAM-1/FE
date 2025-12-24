import React, { useState, useEffect } from 'react';
import styles from './NewTravelSection.module.css';
import { createChatRoom, addMember } from '../../../apis/chatApi';
import DateSelectionStep from './DateSelectionStep';
import StyleSelectionStep from './StyleSelectionStep';
import RoomCreationStep from './RoomCreationStep';

const NewTravelSection = ({ onWizardStateChange }) => {
    // Step 0: Entry, Step 1: Date, Step 2: Style, Step 3: Room Creation
    const [step, setStep] = useState(0);

    // Notify parent about wizard state
    useEffect(() => {
        if (onWizardStateChange) {
            onWizardStateChange(step > 0);
        }
    }, [step, onWizardStateChange]);

    // Step 1 State
    const [selectedTab, setSelectedTab] = useState('date');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);

    // Step 2 State
    const [selectedStyleId, setSelectedStyleId] = useState(null);

    // Step 3 State
    const [roomName, setRoomName] = useState("");
    const [invitedMemberIds, setInvitedMemberIds] = useState([]); // [추가] 초대할 멤버 ID 목록

    // --- Handlers ---
    const handleAddMember = (identifier) => {
        if (!invitedMemberIds.includes(identifier)) {
            setInvitedMemberIds([...invitedMemberIds, identifier]);
            alert(`${identifier}님이 초대 목록에 추가되었습니다.`);
        } else {
            alert("이미 추가된 멤버입니다.");
        }
    };

    const handleStartWizard = (targetStep, tab = 'date') => {
        if (targetStep === 1) {
            setSelectedTab(tab);
            setStep(1);
        } else if (targetStep === 2) {
            setStep(2);
        }
    };

    const handleDateClick = (dateObj) => {
        if (!dateObj) return;

        if (selectedTab === 'date') {
            const time = dateObj.getTime();
            const start = startDate ? startDate.getTime() : null;

            if (!startDate || (startDate && endDate)) {
                setStartDate(dateObj);
                setEndDate(null);
            } else {
                if (time < start) {
                    setEndDate(startDate);
                    setStartDate(dateObj);
                } else {
                    setEndDate(dateObj);
                }
            }
        } else {
            const time = dateObj.getTime();
            const exists = selectedDates.some(d => d.getTime() === time);
            if (exists) {
                setSelectedDates(selectedDates.filter(d => d.getTime() !== time));
            } else {
                setSelectedDates([...selectedDates, dateObj]);
            }
        }
    };

    const handleNextStep = () => {
        setStep(2);
    };

    const handleGoToCreation = () => {
        setStep(3);
    };

    const handleBackToStep2 = () => {
        setStep(2);
    };



    const handleStartChat = async () => {
        try {
            // 날짜 포맷팅 (YYYY-MM-DD)
            const formatDate = (date) => {
                if (!date) return null;
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            };

            let start = null;
            let end = null;

            if (selectedTab === 'date') {
                start = formatDate(startDate);
                end = formatDate(endDate);
            } else if (selectedTab === 'flexible' && selectedDates.length > 0) {
                // 유연한 일정인 경우 선택된 날짜 중 가장 빠른 날과 늦은 날을 범위로 설정 (임시 로직)
                const sorted = [...selectedDates].sort((a, b) => a - b);
                start = formatDate(sorted[0]);
                end = formatDate(sorted[sorted.length - 1]);
            }

            const payload = {
                name: roomName,
                startDate: start,
                endDate: end,
                travelStyle: selectedStyleId
            };

            console.log("Creating Chat Room with payload:", payload);

            // 1. 채팅방 생성 API 호출
            const newRoom = await createChatRoom(payload);
            console.log("Created Room:", newRoom);

            const roomId = newRoom?.roomId || newRoom?.id; // 백엔드 응답 필드 확인

            // 2. 초대된 멤버가 있다면 추가 API 호출
            if (roomId && invitedMemberIds.length > 0) {
                console.log("Adding members:", invitedMemberIds);
                // 병렬 처리 또는 순차 처리
                await Promise.all(invitedMemberIds.map(id => addMember(roomId, id)));
            }

            // 성공 시 위젯 닫고 목록 새로고침 (또는 생성된 방으로 이동)
            // 현재는 간단히 reload 또는 상위 컴포넌트 알림
            alert("여행톡이 생성되었습니다!");
            window.location.reload(); // 목록 갱신을 위해 리로드

        } catch (error) {
            console.error("Failed to create chat room:", error);
            alert("채팅방 생성에 실패했습니다.");
        }
    };

    // --- Helpers ---
    const formatDateRange = () => {
        if (selectedTab === 'date' && startDate && endDate) {
            return `${startDate.getMonth() + 1}.${startDate.getDate()}-${endDate.getMonth() + 1}.${endDate.getDate()}`;
        }
        if (selectedTab === 'flexible' && selectedDates.length > 0) {
            const sorted = [...selectedDates].sort((a, b) => a - b);
            if (sorted.length === 1) return `${sorted[0].getMonth() + 1}.${sorted[0].getDate()}`;
            return `${sorted[0].getMonth() + 1}.${sorted[0].getDate()} 외 ${sorted.length - 1}일`;
        }
        return '';
    };

    const getStepClass = (stepIndex) => {
        if (step === stepIndex) return styles.active;
        if (step > stepIndex) return styles.slideOutLeft;
        return styles.slideInRight;
    };

    return (
        <div
            className={styles.container}
            style={{ marginTop: step > 0 ? '12px' : '48px' }}
        >
            <h2 className={styles.title}>새로운 여행톡을 시작해 보세요</h2>

            {/* STEP 0: Entry Buttons */}
            {step === 0 && (
                <div style={{ width: '100%', animation: 'fadeIn 0.3s' }}>
                    <button
                        className={styles.entryButton}
                        onClick={() => handleStartWizard(1, 'date')}
                    >
                        <span className={styles.entryText}>여행 날짜가 정해졌나요?</span>
                        <span className={styles.entryAction}>날짜 추가</span>
                    </button>
                    <button
                        className={styles.entryButton}
                        onClick={() => handleStartWizard(2)}
                    >
                        <span className={styles.entryText}>이번 여행의 스타일을 알려주세요</span>
                        <span className={styles.entryAction}>스타일 추가</span>
                    </button>
                </div>
            )}

            {/* STEP 1 */}
            <div className={`${styles.stepWrapper} ${getStepClass(1)}`}>
                <DateSelectionStep
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    startDate={startDate}
                    endDate={endDate}
                    selectedDates={selectedDates}
                    onDateClick={handleDateClick}
                    onNext={handleNextStep}
                />
            </div>

            {/* STEP 2 */}
            <div className={`${styles.stepWrapper} ${getStepClass(2)}`}>
                <StyleSelectionStep
                    dateRangeText={formatDateRange()}
                    selectedStyleId={selectedStyleId}
                    setSelectedStyleId={setSelectedStyleId}
                    onNext={handleGoToCreation}
                />
            </div>

            {/* STEP 3 */}
            <div className={`${styles.stepWrapper} ${getStepClass(3)}`}>
                <RoomCreationStep
                    roomName={roomName}
                    setRoomName={setRoomName}
                    onBack={handleBackToStep2}
                    onStartChat={handleStartChat}
                    onAddMember={handleAddMember}
                />
            </div>
        </div>
    );
};

export default NewTravelSection;
