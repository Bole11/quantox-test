import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; 
import styles from "../styles/BackButton.module.css";
import backLight from '../images/back-light.png'; 
import backDark from '../images/back-dark.png'; 

export function BackButton({ onClick, className = '' }) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else {
            navigate(-1);
        }
    };

    return (
        <button 
            onClick={handleClick}
            className={`${styles.backButton} ${className}`}
            aria-label="Go back"
        >
            <img 
                src={theme === 'light' ? backLight : backDark} 
                alt="Back" 
                className={styles.backIcon}
            />
        </button>
    );
}