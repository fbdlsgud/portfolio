import { useState } from "react";
import "./About.css";

import { GiSkills } from "react-icons/gi";

function About() {
  const [skills, setSkills] = useState(["Java", "JavaScript"]);
  const [skillModal, setSkillModal] = useState(false);

  const skillUpdate = () => {
    setSkillModal(true);
  };

  return (
    <div className="aboutContainer">
      <div className="aboutIntroduce-left fade-in">
        <p className="title">About</p>
        <p className="subtitle">저에 대해 소개해드릴게요!</p>
      </div>

      <div className="aboutIntroduce-right">
        <div className="introduce">
          <p className="hi">Hello World !</p>
          <p className="intro">
            안녕하세요 ! <br />
            다양한 기술스택을 배우며 성장하는 개발자가 되기 위해 노력하는 {"  "}
            <span className="highlight">신입 개발자 류인형</span> 입니다.
          </p>
          <br />

          <p className="subIntro">
            저는 단순히 동작하는 기능을 만드는 개발자가 되기보다, 사용자가 어떤
            흐름으로 움직이고, 무엇을 느낄지를 먼저 고민하는 개발자가 되고
            싶습니다. <br />
            눈에 보이지 않는 작은 불편 하나도 놓치지 않고, 한 줄의 코드가
            사용자에게 더 나은 경험을 줄 수 있도록 고민하며 개발합니다.
            <br />
            저에게 '개발자' 란 기술을 통해 문제를 해결하는 사람이라 생각합니다.
            <br /> 저는 그 문제의 중심을 언제나 사용자 입장에서 바라보며, 더
            쉽고, 더 즐겁게, 더 편리하게 만들기 위해 노력하고 있습니다.
          </p>
        </div>
        {skillModal && (
          <SkillModal
            onClose={() => setSkillModal(false)}
            setSkills={setSkills}
            skills={skills}
          />
        )}
        <div className="skillContainer">
          <div className="skillCon1">
            <div className="skillTitle">
              {" "}
              <GiSkills size={27} /> Skill
            </div>
            <button className="skillUp" onClick={skillUpdate}>
              스킬 등록
            </button>
          </div>
          <div className="skillInfo">
            {skills.map((skill, i) => (
              <div key={i}>{skill}</div>
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

  const newSkillUpdate = () => {
    if(skills.includes(newSkills)){
        alert("이미 등록된 스킬입니다");
        return;
    }

    if(newSkills.trim() === "") {
        alert("빈칸으로 등록할 수 없습니다.");
        return;
    }

    if (newSkills.trim() !== "") {
      setSkills([...skills, newSkills]);
      setNewSkills("");
      alert("새로운 스킬이 등록되었습니다");
      onClose();
    }
  };

  return (
    <div className="skillUpdateModal">
      <input
        placeholder="스킬 입력!"
        value={newSkills}
        onChange={(e) => setNewSkills(e.target.value)}
      ></input>
      <button onClick={newSkillUpdate}>등록</button>

      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default About;
