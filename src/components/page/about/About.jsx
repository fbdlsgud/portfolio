import { useState, useEffect } from "react";
import styles from "./About.module.css";

import { GiSkills } from "react-icons/gi";

import axios from "../../../axios/axiosInstance";
import { useLogin } from "../../../context/LoginContext";

function About() {
  const [skills, setSkills] = useState([]);
  const [skillModal, setSkillModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const { username } = useLogin();

  const skillUpdate = () => {
    setSkillModal(true);
  };

  const skillEdit = (skill) => {
    setSelectedSkill(skill);
    setEditModal(true);
  };

  const skillDelete = (sid) => {
    axios
      .delete(`/skillDelete/${sid}`)
      .then((res) => {
        console.log(res.data.sid + "번 스킬 삭제 성공!");
        alert("삭제 성공");
        axios
          .get("/skillsList")
          .then((res) => {
            setSkills(res.data);
          })
          .catch((err) => {
            console.log(err);
            alert("불러오기 실패");
          });
      })
      .catch((err) => {
        console.log(err);
        alert("삭제 실패!");
      });
  };

  useEffect(() => {
    axios.get("/skillsList").then((res) => {
 
      setSkills(res.data);
    });
  }, []);

  return (
    <div className={styles.aboutContainer}>
      <div className={`${styles.aboutIntroduceLeft} fade-in`}>
        <p className={styles.title}>About</p>
        <p className={styles.subtitle}>저에 대해 소개해드릴게요!</p>
        <div className={styles.profileCard}>
          <img
            src="/my/profile.jpg"
            alt="프로필 사진"
            className={styles.profileImage}
          />
          <h2 className={styles.profileName}>류인형</h2>
          <p className={styles.profileRole}>Full-Stack Developer</p>

          <div className={styles.contactList}>
            <div className={styles.contactRow}>📱 TEL : 010-5513-9692</div>
            <div className={styles.contactRow}>💬 KAKAO : ryu9692</div>
            <div
              className={`${styles.contactRow} ${styles.copyable}`}
              onClick={() => {
                navigator.clipboard.writeText("fbdlsgud9500@naver.com");
                alert("이메일 복사 완료");
              }}
            >
              ✉️ fbdlsgud9500@naver.com
            </div>
            <div className={styles.contactRow}>
              🐙   {" "}
              <a
                href="https://github.com/fbdlsgud"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/fbdlsgud
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.aboutIntroduceRight} fade-right`}>
        <div className={styles.introduce}>
          <p className={styles.hi}>Hello World !</p>
          <p className={styles.intro}>
            안녕하세요 ! <br />
            다양한 기술스택을 배우며 성장하는 개발자가 되기 위해 노력하는 {"  "}
            <span className={styles.highlight}> 개발자 류인형</span> 입니다.
          </p>
          <br />

          <p className={styles.subIntro}>
            저는 단순히 동작하는 기능을 만드는 개발자가 되기보다, 사용자가 어떤
            흐름으로 움직이고, <br />
            무엇을 느낄지를 먼저 고민하는 개발자가 되고 싶습니다. <br />
            <br />
            눈에 보이지 않는 작은 불편 하나도 놓치지 않고, 한 줄의 코드가
            사용자에게 더 나은 경험을 줄 수 있도록 <br />
            고민하며 개발합니다.
            <br />
            <br />
            저에게 '개발자' 란 기술을 통해 문제를 해결하는 사람이라 생각합니다.
            <br /> 저는 그 문제의 중심을 언제나 사용자 입장에서 바라보며, 더
            쉽고, 더 즐겁게, 더 편리하게 만들기 위해 <br />
            노력하고 있습니다.
          </p>
        </div>
        {skillModal && (
          <SkillModal
            onClose={() => setSkillModal(false)}
            setSkills={setSkills}
            skills={skills}
          />
        )}
        {editModal && (
          <EditModal
            onClose={() => {
              setEditModal(false);
            }}
            skill={selectedSkill}
            setSkills={setSkills}
          />
        )}
        <div className={styles.skillContainer}>
          <div className={styles.skillCon1}>
            <div className={styles.skillTitle}>
              {" "}
              <GiSkills size={27} /> Skill
            </div>
            {username ? (
              <button className={styles.skillUp} onClick={skillUpdate}>
                스킬 등록
              </button>
            ) : (
              ""
            )}
          </div>
          <div className={styles.skillInfo}>
            {skills.map((skill, i) => (
              <div
                key={i}
                className={styles.skillList}
                onClick={() => {
                  if (username) {
                    skillEdit(skill);
                  } else {
                    return;
                  }
                }}
              >
                <div className={styles.skillName}>🔧 {skill.skillName}</div>
                {username ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      skillDelete(skill.sid);
                    }}
                    className={styles.skillDelete}
                  >
                    스킬 삭제
                  </button>
                ) : (
                  ""
                )}
                <div className={styles.skillDesc}> {skill.skillDesc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 스킬업데이트 모달
function SkillModal({ onClose, setSkills, skills }) {
  const [newSkills, setNewSkills] = useState("");
  const [newSkillDesc, setNewSkillDesc] = useState("");

  const newSkillUpdate = () => {
    if (skills.includes(newSkills)) {
      alert("이미 등록된 스킬입니다");
      return;
    }

    if (newSkills.trim() === "") {
      alert("빈칸으로 등록할 수 없습니다.");
      return;
    }

    if (newSkills.trim() !== "") {
      axios
        .post("/addSkill", { skillName: newSkills, skillDesc: newSkillDesc })
        .then(() => {
          alert("새로운 스킬이 등록되었습니다!");
          setNewSkills("");

          axios.get("/skillsList").then((res) => {
            setSkills(res.data);
          });

          onClose();
        })
        .catch((err) => {
          console.log(err);
          alert("등록 실패");
        });
    }
  };

  return (
    <div className={styles.skillUpdateModal}>
      스킬 등록
      <input
        placeholder="스킬 입력!"
        value={newSkills}
        onChange={(e) => setNewSkills(e.target.value)}
      ></input>
      <textarea
        rows={4}
        placeholder="스킬 설명입력"
        value={newSkillDesc}
        onChange={(e) => {
          setNewSkillDesc(e.target.value);
        }}
      />
      <button onClick={newSkillUpdate}>등록</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

function EditModal({ onClose, skill, setSkills }) {
  const [editSkill, setEditSkill] = useState({
    sid: skill.sid,
    skillName: skill.skillName,
    skillDesc: skill.skillDesc,
  });

  const skillEdit = () => {
    axios
      .put("/skillEdit", editSkill)
      .then(() => {
        alert("수정 완료!");
        onClose();
        axios.get("/skillsList").then((res) => {
          setSkills(res.data);
        });
      })
      .catch((err) => {
        console.log(err);
        alert("수정 실패");
      });
  };

  return (
    <div className={styles.skillUpdateModal}>
      {" "}
      스킬 수정
      <input
        placeholder="스킬 입력!"
        value={editSkill.skillName}
        onChange={(e) =>
          setEditSkill({ ...editSkill, skillName: e.target.value })
        }
      ></input>
      <textarea
        rows={4}
        placeholder="스킬 설명입력"
        value={editSkill.skillDesc}
        onChange={(e) =>
          setEditSkill({ ...editSkill, skillDesc: e.target.value })
        }
      />
      <button onClick={skillEdit}>등록</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default About;
