import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import { getProfile, updateProfile } from '../../apis/api';

// Assets
import profileImg from '../../assets/pic/dogeja_cat1.png'; // Fallback or user image
import iconCamera from '../../assets/pic/채팅방/사진선택.png';

const MyPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    // Hooks must be unconditional. Effects too.
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate('/login');
                return;
            }

            try {
                const data = await getProfile();
                console.log('Profile Data Loaded:', data);
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
                if (error.response && error.response.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Derived state (safe to compute every render)
    const birthDateParts = profile?.birthDate ? profile.birthDate.split('-') : ['YYYY', 'MM', 'DD'];

    // Toggle Edit Mode
    const handleEditToggle = async () => {
        if (isEditing) {
            // Save changes
            try {
                // 생년월일 조합 (YYYY-MM-DD)
                const fullBirthDate = `${editData.year || birthDateParts[0]}-${editData.month || birthDateParts[1]}-${editData.day || birthDateParts[2]}`;

                // 부분 수정 지원: 변경할 필드만 전송
                const payload = {
                    nickname: editData.nickname,
                    birthDate: fullBirthDate
                };

                await updateProfile(payload);
                // 로컬 profile 상태도 부분 업데이트
                setProfile(prev => ({ ...prev, ...payload }));
                setIsEditing(false);
                alert("회원 정보가 수정되었습니다.");
            } catch (error) {
                console.error("Failed to update profile", error);
                if (error.response && error.response.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    return;
                }
                alert("수정에 실패했습니다.");
            }
        } else {
            // Enter Edit Mode
            setEditData({
                nickname: profile?.nickname || profile?.username || "",
                year: birthDateParts[0] !== 'YYYY' ? birthDateParts[0] : '',
                month: birthDateParts[1] !== 'MM' ? birthDateParts[1] : '',
                day: birthDateParts[2] !== 'DD' ? birthDateParts[2] : ''
            });
            setIsEditing(true);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            {/* Header / Back Button */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Profile Section */}
            <div className={styles.profileSection}>
                <div className={styles.profileImageWrapper}>
                    <img src={profile?.profileImageUrl || profileImg} alt="Profile" className={styles.profileImage} />
                    <img src={iconCamera} alt="Edit" className={styles.cameraBadge} />
                </div>

                {isEditing ? (
                    <input
                        type="text"
                        name="nickname"
                        value={editData.nickname}
                        onChange={handleEditChange}
                        className={styles.editInput}
                        placeholder="닉네임"
                        style={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '8px', marginBottom: '4px' }}
                    />
                ) : (
                    <h2 className={styles.userName}>{profile?.nickname || profile?.username || "User"}</h2>
                )}

                <span className={styles.editProfileLink} onClick={handleEditToggle}>
                    {isEditing ? "완료" : "수정"}
                </span>
            </div>

            <div className={styles.divider} />

            {/* Member Info Section */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>회원 정보</h3>
                <p className={styles.userId}>아이디: {profile?.username || "unknown"}</p>

                <div className={styles.birthDateContainer}>
                    <span className={styles.fieldLabel}>생년월일</span>
                    <div className={styles.dateInputs}>
                        {isEditing ? (
                            <>
                                <input
                                    type="text" name="year" value={editData.year} onChange={handleEditChange} placeholder="YYYY"
                                    className={styles.dateBox} style={{ width: '60px', textAlign: 'center' }}
                                />
                                <input
                                    type="text" name="month" value={editData.month} onChange={handleEditChange} placeholder="MM"
                                    className={styles.dateBox} style={{ width: '40px', textAlign: 'center' }}
                                />
                                <input
                                    type="text" name="day" value={editData.day} onChange={handleEditChange} placeholder="DD"
                                    className={styles.dateBox} style={{ width: '40px', textAlign: 'center' }}
                                />
                            </>
                        ) : (
                            <>
                                <div className={styles.dateBox}>{birthDateParts[0]}</div>
                                <div className={styles.dateBox}>{birthDateParts[1]}</div>
                                <div className={styles.dateBox}>{birthDateParts[2]}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            {/* Travel Style Edit */}
            <div className={styles.menuItem} onClick={() => navigate('/mypage/edit-style')}>
                <div className={styles.menuContent}>
                    <h3 className={styles.menuTitle}>여행스타일 수정</h3>
                    <p className={styles.menuDesc}>더욱 맞춤화된 일정 추천을 경험해보세요!</p>
                </div>
                <span className={styles.chevron}>&gt;</span>
            </div>

            <div className={styles.divider} />

            {/* Map */}
            <div className={styles.menuItem}>
                <div className={styles.menuContent}>
                    <h3 className={styles.menuTitle}>지도</h3>
                    <p className={styles.menuDesc}>다녀온 여행지, 즐겨찾기</p>
                </div>
                {/* Implicit chevron or just description? Image cut off but likely link-like */}
                {/* <span className={styles.chevron}>&gt;</span> */}
            </div>

            {/* Delete Account */}
            <div className={styles.deleteAccountContainer}>
                <button className={styles.deleteAccountButton}>회원 탈퇴하기</button>
            </div>
        </div>
    );
};

export default MyPage;
