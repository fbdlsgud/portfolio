import { useEffect, useState } from "react";
import styles from "./Board.module.css";
import axios from "../../../axios/axiosInstance";
import { useLogin } from "../../../context/LoginContext";

function Board() {
  const avatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
  ];

  const {username} = useLogin();

  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [reply, setReply] = useState("");

    // 어떤 댓글(index)의 입력창이 열려 있는지
    const [openPwdIndex, setOpenPwdIndex] = useState(null);

    // 댓글마다 입력한 비밀번호 저장
    const [pwdInputs, setPwdInputs] = useState({});

  const [replyInfo, setReplyInfo] = useState([]);

  const data = { avatar, userId, userPwd, reply };

  useEffect(() => {
    axios
      .get("/replyList")
      .then((res) => {
        setReplyInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const replyHandler = () => {
    if (!avatar.trim()) {
      alert("아바타를 선택해주세요!");
      return;
    }
    if (!userId.trim()) {
      alert("닉네임을 설정해주세요!");
      return;
    }
    if (!userPwd.trim()) {
      alert("비밀번호를 입력해주세요!");
      return;
    }
    if (!reply.trim()) {
      alert("댓글 내용을 입력해주세요!");
      return;
    } else {
      axios
        .post("/addReply", data)
        .then((res) => {
          alert("소중한 댓글 감사합니다!");

          axios
            .get("/replyList")
            .then((res) => {
              setReplyInfo(res.data);
            })
            .catch((err) => {
              console.log(err);
            });

          setAvatar("");
          setUserId("");
          setUserPwd("");
          setReply("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteReply = (rid, inputPwd) => {
    axios
      .post("/deleteReply", { rid, userPwd: inputPwd })
      .then((res) => {
        alert("삭제 성공!");
        return axios.get("/replyList");
      })
      .then((res) => {
        setReplyInfo(res.data); 
        setOpenPwdIndex(null);  
      })
      .catch((err) => {
        console.log("삭제 실패", err);
        alert("비밀번호가 일치하지 않습니다.");
      });
  };

  const deleteAllHandler = () => {

    if(!window.confirm("댓글 전체 삭제할까요?")) return;

    axios
      .post("/deleteAll")
      .then(()=>{
        alert("전체 삭제 완료");

        axios.get("replyList").then((res)=>setReplyInfo(res.data));
      })
      .catch((err)=>{console.error("삭제 실패", err); alert("삭제 중 오류가 발생했습니다.")});
  }


  return (
    <div className={styles.boardContainer}>
      <div className={`${styles.boardLeft} fade-in`}>
        <p className={styles.title}>Board</p>
        <p className={styles.subTitle}>코멘트를 달아주세요!</p>
      </div>
      <div className={`${styles.boardRight} fade-right`}>
        <div className={styles.boardSelect}>
          <div className={styles.avatarList}>
            {avatars.map((img, i) => (
              <img
                key={i}
                src={`/avatars/${img}`}
                alt="avatar"
                onClick={() => setAvatar(img)}
                style={{
                  width: avatar === img ? 95 : 65,
                  height: avatar === img ? 95 : 65,
                  cursor: "pointer",
                  borderRadius: "50%",
                  marginLeft: "20px",
                  border: avatar === img ? "3px solid #3a86ff" : "none",
                  boxShadow:
                    avatar === img
                      ? "0 0 10px rgba(58, 134, 255, 0.5)"
                      : "none",
                }}
              />
            ))}
          </div>
          <div className={styles.userInfo}>
            닉네임{" "}
            <input
              type="text"
              placeholder="닉네임을 설정해주세요!"
              className={styles.inputStyle}
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
              }}
            />
            비밀번호
            <input
              type="password"
              placeholder="비밀번호를 설정해주세요!"
              className={styles.inputStyle}
              value={userPwd}
              onChange={(e) => {
                setUserPwd(e.target.value);
              }}
            />
          </div>
          <div className={styles.textNbtn}>
            <textarea
              rows={3}
              placeholder="댓글 내용을 입력해주세요."
              className={styles.textarea}
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
              }}
            />
            <button className={styles.submitBtn} onClick={replyHandler}>
              작성
            </button>
            {username ? (
              <button onClick={deleteAllHandler}>댓글 전체 삭제</button>
            ) : ""}
          </div>
        </div>
        <div>
          {
            <div className={styles.replyList}>
            {replyInfo.map((reply, i) => (
              <div key={i} className={styles.replyItem}>
                <div className={styles.replyHeader}>
                  <img
                    src={`/avatars/${reply.avatar}`}
                    alt="avatar"
                    className={styles.replyAvatar}
                  />
                  <strong>{reply.userId}</strong>
      
                  <button
                    className={styles.deleteIconBtn}
                    onClick={() =>
                      setOpenPwdIndex(openPwdIndex === i ? null : i)
                    }
                  >
                    🗑️
                  </button>
                </div>
      
                <p className={styles.replyText}>{reply.reply}</p>
      
                {openPwdIndex === i && (
                  <div className={styles.pwdBox}>
                    <input
                      type="password"
                      placeholder="비밀번호 입력"
                      className={styles.pwdInput}
                      value={pwdInputs[i] || ""}
                      onChange={(e) =>
                        setPwdInputs({ ...pwdInputs, [i]: e.target.value })
                      }
                    />
                    <button
                      className={styles.pwdSubmitBtn}
                      onClick={() => {
                        deleteReply(reply.rid, pwdInputs[i]);
                      }}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Board;
