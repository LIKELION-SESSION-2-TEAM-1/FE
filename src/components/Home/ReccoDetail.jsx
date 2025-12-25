import React from "react";
import styles from './ReccoDetail.module.css';
import pic4 from "../../assets/pic/pic4.png";
import pic5 from "../../assets/pic/pic5.png";
import pic6 from "../../assets/pic/pic6.png";
import arrow4 from "../../assets/pic/arrow4.svg";
import useAuthStore from '../../stores/useAuthStore';

const ReccoDetail = ({ className, onClose }) => {
    const { user } = useAuthStore();
    const userName = user?.username || '뿡뻉';

    return (
        <div className={styles.reccoDetail}>
            <div>
                <img src={arrow4} onClick={onClose} className={styles.arrow} alt="close" />
                <p className={styles.text1}>맞춤 여행지 추천</p>
                <p className={styles.text2}>{userName}님 연령대가 <br />많이 찾은 곳</p>
                <div className={styles.box}>
                    <img src={pic4} className={styles.pic4} alt="top 3 travel" />
                    <p className={styles.top}>top<br />3</p>
                </div>
                <img src={pic5} className={styles.pic5} alt="recommendation 1" />
                <img src={pic6} className={styles.pic6} alt="recommendation 2" />
            </div>
        </div>
    );
};

export default ReccoDetail;