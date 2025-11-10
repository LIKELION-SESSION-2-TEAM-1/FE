import styles from './Home.module.css';
import pic from "../../../assets/pic/pic1.png";
import arrow from "../../../assets/pic/arrow.svg";
import { NavLink } from 'react-router-dom';
import search from "../../../assets/pic/search.svg";
import trip from "../../../assets/pic/trip.svg";
import pic2 from "../../../assets/pic/pic2.png";

const Home = () => {
    return (
        <div className={styles.main__wrapper}>
            <div className={styles.main__container}>
                <div className={styles.main__card}>
                    <div className={styles.card__text}>
                        <p className={styles.card__text1}>막막했던 여행,<br />대화로 시작하세요.</p>
                        <p className={styles.card__text2}>친구들을 초대해서 대화만으로 계획을 완성하세요.</p>
                    </div>
                    <img src={pic} alt="" className={styles.card__pic} />
                    
                    <NavLink to='/chat' className={styles.item}>
                    <div className={styles.card__button}>
                        <p className={styles.card__text3}>새로운 여행계획 시작하기</p>
                        <img src={arrow} alt="" className={styles.card__arrow}/>
                    </div>
                    </NavLink>
                    
                    <div className={styles.searchBar}>
                        <img src={search} alt="" className={styles.searchBar__icon}/>
                        <input className={styles.searchBar__input} type="search" placeholder='여행지 검색하기' />
                    </div>

                    <div className={styles.cardsContainer}>
                        <div className={styles.recco}>
                            <p className={styles.recco__text}>맞춤<br/>여행지<br/>추천</p>
                            <img src={trip} alt="" className={styles.recco__img}/>
                        </div>
                        <div className={styles.cards}>
                            <div className={styles.style}>
                                <p className={styles.style__text}>여행 스타일<br/>설정하기</p>
                            </div>
                            <img src={pic2} alt="" className={styles.pic2}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;