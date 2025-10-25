import styles from './Home.module.css';
import Header from '../../../components/Header/Header';
import pic from "../../../assets/pic/pic1.png";
import arrow from "../../../assets/pic/arrow.svg";
import { NavLink } from 'react-router-dom';

const Home = () => {
    return (
        <div className={styles.main__wrapper}>
            <div className={styles.main__container}>
                <div className={styles.main__card}>
                    <div className={styles.card__text}>
                        <p className={styles.card__text1}>막막했던 여행,<br />대화로 시작하세요.</p>
                        <p className={styles.card__text2}>친구들을 초대해서 대화만으로 계획을 완성하세요.</p>
                    </div>
                    <img src={pic} className={styles.card__pic} />
                    <NavLink to='/chat' className={styles.item}>
                    <div className={styles.card__button}>
                        
                        <p className={styles.card__text3}>새로운 여행계획 시작하기</p>
                        <img src={arrow} className={styles.card__arrow}/>
                    </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Home;