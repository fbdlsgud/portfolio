import { Link } from "react-router-dom";
import styles from "./Main.module.css"; // 💡 모듈 CSS로 변경

function Main() {
  return (
    <div className={`${styles.mainContainer} fade-in`}>
      <div className={styles.mainIntroduce}>
        <p className={styles.info1}>FRONT END & BACK END</p>
        <p className={styles.info2}>WEB DEVELOPER</p>
        <p className={styles.info2}>PORTFOLIO</p>
        <p className={styles.shortBorder} />
        <p className={styles.introduce}>
          안녕하세요! 저만의 포트폴리오 사이트에 와주셔서 감사합니다!
        </p>
        <p className={styles.introduce}>
          부족하지만 항상 새로운 기술에 도전하고 싶은 류인형입니다!
        </p>
      </div>

      <div className={styles.subMenubar}>
        <Link to={"/about"} className={styles.subMenu}>
          <span className={styles.emoji}>👨🏻‍🔧</span>
          <span className={styles.text}>About me</span>
        </Link>
        <Link to={"/project"} className={styles.subMenu}>
          <span className={styles.emoji}>💻</span>
          <span className={styles.text}>Project</span>
        </Link>
        <Link to={"/board"} className={styles.subMenu}>
          <span className={styles.emoji}>👨🏻</span>
          <span className={styles.text}>Guest Board</span>
        </Link>
      </div>
    </div>
  );
}

export default Main;
