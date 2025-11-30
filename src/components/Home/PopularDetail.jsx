import React from "react";
import styles from './PopularDetail.module.css';
import pic3 from "../../assets/pic/pic3.png";
import arrow5 from "../../assets/pic/arrow5.svg";

const PopularDetail = ({ className , onClose }) => {
    return (
        <div className={styles.popularDetail}>
            <img src={arrow5} onClick = {onClose} className={styles.arrow}/>
            <div className={styles.box}>
                <p className={styles.text1}>이번주 인기 여행지</p>
                <p className={styles.date}>2025.9월 넷째주</p>
            </div>
            <img src={pic3} className={styles.pic}/>
            <p className={styles.rank}>랭킹</p>
            <div className={styles.textBox}>
                <p>1. 강원도 강릉<br/>2. 인천광역시 강화도<br/>3. 부산광역시</p>
                <p>4. 제주특별자치도<br/>5. 서울특별시<br/>6. 경기도 가평</p>
            </div>
        </div>
    )
};

export default PopularDetail;