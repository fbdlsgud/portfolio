import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css"; // 💡 CSS Modules로 변경

function Header(){
  const location = useLocation(); // 현재 경로 확인

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitle}>
        <Link to="/" className={styles.link}>인형's 포트폴리오</Link>
      </div>
      <div className={styles.headerMenu}>
        <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.active : ""}`}>Main</Link>
        <Link to="/about" className={`${styles.link} ${location.pathname === "/about" ? styles.active : ""}`}>About</Link>
        <Link to="/project" className={`${styles.link} ${location.pathname === "/project" ? styles.active : ""}`}>Project</Link>
        <Link to="/board" className={`${styles.link} ${location.pathname === "/board" ? styles.active : ""}`}>Board</Link>
        <Link to="/contact" className={`${styles.link} ${location.pathname === "/contact" ? styles.active : ""}`}>Contact</Link>
      </div>
    </div>
  );
}

export default Header;
