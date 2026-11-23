import { useState } from "react";
import styles from "./Login.module.css";
import axios from "../../axios/axiosInstance";
import { useLogin } from "../../context/LoginContext";

function Login({ onClose }) {
  const [loginId, setLoginId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const { setUsername } = useLogin();

  const loginHandler = () => {
    if (loginId.trim() === "" || loginPwd.trim() === "") {
      alert("아이디 또는 비밀번호를 입력해주세요");
      return;
    }
    axios
      .post("/login", { loginId, loginPwd })
      .then((res) => {
        alert("로그인 성공!");
        setUsername(res.data.username);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        alert("관리자 전용 로그인입니다! 아이디 또는 비밀번호를 확인해주세요");
      });
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.loginText}>
        <p>Login</p>
        <p>only admin login</p>
      </div>
      <div className={styles.loginInput}>
        <input
          type="text"
          placeholder="아이디"
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={loginPwd}
          onChange={(e) => {
            setLoginPwd(e.target.value);
          }}
        />
      </div>
      <div className={styles.btnGroup}>
        <button className={styles.loginBtn} onClick={loginHandler}>
          로그인
        </button>
        <button className={styles.CloseBtn} onClick={onClose}>
          close
        </button>
      </div>
    </div>
  );
}

export default Login;
