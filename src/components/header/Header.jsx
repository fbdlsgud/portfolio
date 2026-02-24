import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css"; // 💡 CSS Modules로 변경
import { useState } from "react";
import Login from "../login/Login";
import { useLogin } from "../../context/LoginContext";

function Header(){
  const location = useLocation(); // 현재 경로 확인

  const {username, setUsername} = useLogin();

  const [loginModal, setLoginModal] = useState(false);
  const loginHandler = () => {
    setLoginModal(true);
  }
  const logoutHandler = () => {
    if(window.confirm("로그아웃 할까요?")){
      setUsername(null);
    }
    else {
      return ;
    }
  }

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
        <Link to="/jump" className={`${styles.link} ${location.pathname === "/jump" ? styles.active : ""}`}>Jump</Link>
        {username?
        <div className={styles.loginName} onClick={logoutHandler}>{username} 관리자님</div>
        :
        <div className={styles.loginLink} onClick={loginHandler}>Login</div>
        }
      </div>
      {loginModal && 
      <>
      <div className={styles.modalOverlay} onClick={() => setLoginModal(false)} />
        <Login onClose={()=> setLoginModal(false)}/>
      </>}
    </div>
  );
}

export default Header;
