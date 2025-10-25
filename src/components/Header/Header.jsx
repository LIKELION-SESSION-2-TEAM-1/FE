import styles from './Header.module.css';
import React from "react";
import logo from '../../assets/pic/TokPlan.png'

const Header = () => {
    return (
        <div className='logo'>
            <img src={logo}></img>
        </div>
    )
}

export default Header;