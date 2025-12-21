import React, { useState, useEffect } from 'react';
import styles from './NewTravelSection.module.css';
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

    // --- Handlers ---
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

    const handleBackToEntry = () => {
        setStep(0);
        // Reset state? Optional.
        setStartDate(null);
        setEndDate(null);
        setSelectedDates([]);
        setSelectedStyleId(null);
        setRoomName("");
    }

    const handleStartChat = () => {
        console.log("FINAL SUBMIT: Starting Chat", {
            type: selectedTab,
            dates: selectedTab === 'date' ? { start: startDate, end: endDate } : selectedDates,
            style: selectedStyleId,
            roomName: roomName
        });
        // Reset to entry (Simulate navigation "Back to list")
        setStep(0);

        // In real app, we would append to ParticipatingChats list here.
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
                {/* Back button for Step 1? Maybe just re-clicking or custom back? 
                    Currently DateSelectionStep doesn't have a back button in UI. 
                    User can re-click entry if we didn't hide it, but we did. 
                    I'll add a temporary back handling if needed, but per design usually there's a back.
                */}
            </div>

            {/* STEP 2 */}
            <div className={`${styles.stepWrapper} ${getStepClass(2)}`}>
                <StyleSelectionStep
                    dateRangeText={formatDateRange()}
                    selectedStyleId={selectedStyleId}
                    setSelectedStyleId={setSelectedStyleId}
                    onNext={handleGoToCreation}
                // onBack={() => setStep(1)} // Should link back to 1
                />
            </div>

            {/* STEP 3 */}
            <div className={`${styles.stepWrapper} ${getStepClass(3)}`}>
                <RoomCreationStep
                    roomName={roomName}
                    setRoomName={setRoomName}
                    onBack={handleBackToStep2}
                    onStartChat={handleStartChat}
                />
            </div>
        </div>
    );
};

export default NewTravelSection;
