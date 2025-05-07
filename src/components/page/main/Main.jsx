import { Link } from "react-router-dom";
import styles from "./Main.module.css";
import { useEffect, useState } from "react";
import axios from "../../../axios/axiosInstance";

function Main() {
  const [today, setToday] = useState(0);
  const [total, setTotal] = useState(0);

  const [project, setProject] = useState([]);
  const [reply, setReply] = useState([]);

  useEffect(() => {
    // ✅ 오늘/전체 방문자 수는 항상 가져와야 함
    axios.get("/visit")
      .then((res) => {
        setToday(res.data.today);
        setTotal(res.data.total);
      })
      .catch((err) => console.log(err));
  }, []);
  
  useEffect(() => {
    // ✅ 방문자 수 증가는 세션 기준으로 한 번만
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      axios.get("/visit") // 이건 단순 증가만 수행 (count++ 저장)
        .then(() => {
          sessionStorage.setItem("visited", "true");
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get("/projectLatest")
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/replyLatest")
      .then((res) => {
        setReply(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={`${styles.mainContainer} fade-in`}>
      <div className={styles.mainLeft}>
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

        <div className={styles.glassMenuBar}>
          <Link to="/about" className={styles.glassCard}>
            <span className={styles.glassIcon}>👨🏻‍🔧</span>
            <span className={styles.glassText}>About me</span>
          </Link>
          <Link to="/project" className={styles.glassCard}>
            <span className={styles.glassIcon}>💻</span>
            <span className={styles.glassText}>Project</span>
          </Link>
          <Link to="/board" className={styles.glassCard}>
            <span className={styles.glassIcon}>📜</span>
            <span className={styles.glassText}>Guest Board</span>
          </Link>
        </div>
      </div>

      <div className={styles.mainRight}>
        {/* 👁️ 방문자 수 */}
        <div className={styles.visitorBox}>
          <span>👁️</span> Today <strong>{today}</strong> / Total{" "}
          <strong>{total}</strong>
        </div>

        {/* 💻 최신 프로젝트 */}
        <div className={styles.infoCard}>
          <h3>💻 최신 프로젝트</h3>
          <Link to="/project" style={{ textDecoration: "none" }}>
            <ul className={styles.projectList}>
              {project.map((p, i) => (
                <li key={i} className={styles.projectItem}>
                  <div className={styles.projectText}>
                    <strong className={styles.projectTitle}>{p.title}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </Link>
        </div>

        {/* 💬 최신 댓글 */}
        <div className={styles.infoCard}>
          <h3>💬 최신 댓글</h3>
          <Link to="/board" style={{ textDecoration: "none" }}>
            <ul className={styles.replyList}>
              {reply.map((r, i) => (
                <li key={i} className={styles.replyItem}>
                  <img
                    src={`/avatars/${r.avatar}`}
                    alt="avatar"
                    className={styles.replyAvatar}
                  />
                  <strong className={styles.replyName}>{r.userId}</strong>
                  <span className={styles.replyText}> {r.reply}</span>
                </li>
              ))}
            </ul>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Main;
