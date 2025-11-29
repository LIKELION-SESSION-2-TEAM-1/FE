import React from "react";
import styles from './ReccoDetail.module.css';
import pic4 from "../../assets/pic/pic4.png";
import pic5 from "../../assets/pic/pic5.png";
import pic6 from "../../assets/pic/pic6.png";
import arrow4 from "../../assets/pic/arrow4.svg";

const ReccoDetail = ({ className, onClose }) => {
    return (
        <div className={styles.reccoDetail}>
            <div>
                <img src={arrow4} onClick={onClose} className={styles.arrow}/>
                <p className={styles.text1}>맞춤 여행지 추천</p>
                <p className={styles.text2}>윤정님 연령대가 <br/>많이 찾은 곳</p>
                <div className={styles.box}>
                    <img src={pic4} className={styles.pic4}/>
                    <p className={styles.top}>top<br/>3</p>
                </div>
                <img src={pic5} className={styles.pic5}/>
                <img src={pic6} className={styles.pic6}/>
            </div>
        </div>
    );
};

export default ReccoDetail;