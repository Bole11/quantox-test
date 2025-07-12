import { useTheme } from "../context/ThemeContext";
import styles from "../styles/ThemeToggle.module.css";
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${theme === 'dark' ? styles.dark : ''}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className={styles.toggleTrack}>
        <span className={styles.toggleThumb}>
          {theme === "light" ? <FiSun size={14}/> : <FiMoon size={14}/>}
        </span>
      </span>
    </button>
  );
};