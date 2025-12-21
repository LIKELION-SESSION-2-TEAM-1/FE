import React, { useState } from 'react';
import styles from './NewTravelSection.module.css';
import DateSelectionStep from './DateSelectionStep';
import StyleSelectionStep from './StyleSelectionStep';

const NewTravelSection = () => {
    const [step, setStep] = useState(1);

    // Step 1 State
    const [selectedTab, setSelectedTab] = useState('date');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);

    // Step 2 State
    const [selectedStyleId, setSelectedStyleId] = useState(null);

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

    const handleFinalSubmit = () => {
        if (selectedStyleId) {
            console.log("Creating Chat Room with:", {
                type: selectedTab,
                startDate,
                endDate,
                selectedDates,
                style: selectedStyleId
            });
            // TODO: Navigate to chat room or make API call
        }
    };

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

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>새로운 여행톡을 시작해 보세요</h2>

            <div className={`${styles.stepWrapper} ${step === 1 ? styles.active : styles.slideOutLeft}`}>
                {step === 1 && (
                    <DateSelectionStep
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        startDate={startDate}
                        endDate={endDate}
                        selectedDates={selectedDates}
                        onDateClick={handleDateClick}
                        onNext={handleNextStep}
                    />
                )}
            </div>

            <div className={`${styles.stepWrapper} ${step === 2 ? styles.active : styles.slideInRight}`}>
                {step === 2 && (
                    <StyleSelectionStep
                        dateRangeText={formatDateRange()}
                        selectedStyleId={selectedStyleId}
                        setSelectedStyleId={setSelectedStyleId}
                        onNext={handleFinalSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default NewTravelSection;
