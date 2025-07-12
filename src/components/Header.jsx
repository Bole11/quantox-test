import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeToggleButton } from "./ThemeToggle.jsx";
import logo from "../images/logo.png";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";

export function Header() {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleCloseMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            };
        };

        document.addEventListener("mousedown", handleCloseMenu);
        return () => {
            document.removeEventListener("mousedown", handleCloseMenu);
        };
    }, []);

    return (
        <header className={`${styles.header}`}>
            <div className={styles.logoContainer}>
                <img 
                    src={logo} 
                    alt="Company Logo" 
                    className={styles.logo}
                />
            </div>

            <div className={styles.controls}>
                <ThemeToggleButton/>
                
                {user && (
                    <div className={styles.userMenuContainer} ref={menuRef}>
                        <img 
                            src={user.image} 
                            alt="User Avatar" 
                            className={styles.avatar}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                        
                        {isMenuOpen && (
                            <div className={`${styles.dropdownMenu}`}>
                                <Link 
                                    to="/myprofile" 
                                    className={styles.menuItem}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className={styles.menuItem}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
};