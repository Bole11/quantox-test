import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "../styles/MyProfile.module.css";
import { Header } from "../components/Header.jsx";
import { BackButton } from "../components/BackButton.jsx";

export function MyProfile() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className={styles.notLoggedIn}>
                <h3>You must be logged in to view this page!</h3>
                <button className={styles.loginButton}>Log in</button>
            </div>
        )
    }

    return (
        <div>
            <Header />
            <div className={styles.profileContainer}>
                <img 
                    src={user.image} 
                    alt={user.username} 
                    className={styles.profileImage}
                />
                <h2 className={styles.username}>@{user.username}</h2>
                <BackButton />
            </div>
            <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>First Name:</span>
                    <span className={styles.detailValue}>{user.firstName}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Last Name:</span>
                    <span className={styles.detailValue}>{user.lastName}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{user.email}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Username:</span>
                    <span className={styles.detailValue}>@{user.username}</span>
                </div>
            </div>
        </div>
    )
};
