import React from 'react';
import companyLogo from '../../company-logo.png';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const handleNavigate = (location) => {
        navigate(location);
    }

    const cookieData = document.cookie
    const sessionData = cookieData.split(',');
    console.log("Usertype is ", sessionData[0])

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/election-manager/">
                    <img src={companyLogo} alt="Company Logo" className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navContainer}>
                <button className={`${styles.noStyleButton} ${styles.navItem}`} onClick={() => handleNavigate('/')}>Logout</button>
                <div className={`${styles.headerText} ${styles.navItem}`}> {sessionData[1]}</div>
            </div>
        </header>
    );
}

export default Header;
