import { useEffect, useState } from "react";
import styles from "./Project.module.css";
import axios from "../../../axios/axiosInstance";
import { useLogin } from "../../../context/LoginContext";

function Project() {
  const { username } = useLogin();

  //프젝//
  const [projects, setProjects] = useState([]);
  //프젝//

  //모달
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  //모달

  const [selectedProject, setSelectedProject] = useState(null);

  const addOpen = () => {
    setAddModalVisible(true);
  };

  const detailOpen = (project) => {
    setDetailModalVisible(true);
    setSelectedProject(project);
  };

  const editOpen = (project) => {
    setEditModalVisible(true);
    setSelectedProject(project);
  };

  const projectDelete = (id) => {
    axios
      .delete(`/projectDelete/${id}`)
      .then((res) => {
        console.log(res.data.id + "번 프로젝트 삭제성공");
        alert("프로젝트 삭제 성공");
        axios.get("/projectList").then((res)=>{setProjects(res.data)}).catch((err)=>{console.log(err); alert("불러오기 실패")})
      })
      .catch((err) => {
        console.log(err);
        alert("프로젝트 삭제 실패!");
      });
  };

  useEffect(() => {
    axios
      .get("/projectList")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.projectContainer}>
      <div className={`${styles.projectLeft} fade-in`}>
        <p className={styles.title}>Project</p>
        <p className={styles.subTitle}>저의 프로젝트를 소개합니다!</p>
      </div>
      {addModalVisible && (
        <AddModal
          onClose={() => {
            setAddModalVisible(false);
          }}
          setProjects={setProjects}
        />
      )}
      {detailModalVisible && (
        <DetailModal
          onClose={() => {
            setDetailModalVisible(false);
          }}
          project={selectedProject}
        />
      )}
      {editModalVisible && (
        <EditModal
          project={selectedProject}
          setProjects={setProjects}
          onClose={() => {
            setEditModalVisible(false);
          }}
        />
      )}
      <div className={`${styles.projectRight} fade-right`}>
        {username && (
          <button className={styles.addBtn} onClick={addOpen}>
            프로젝트 등록
          </button>
        )}
        <div className={styles.projectList}>
          {projects.map((project, i) => {
            return (
              <div
                className={styles.projectItem}
                key={i}
                onClick={() => {
                  username ? editOpen(project) : detailOpen(project);
                }}
              >
                <p className={styles.proTitle}>{project.title}</p>
                {username ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      projectDelete(project.id);
                    }}
                  >
                    프로젝트 삭제
                  </button>
                ) : (
                  ""
                )}
                <div className={styles.projectSub}>
                  <div className={styles.skillList}>
                    {(project.skill || "").split(",").map((skill, i) => (
                      <span key={i} className={styles.skillBadge}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <p className={styles.projPeople}>인원 : {project.people}</p>
                  <p className={styles.projDate}>
                    프로젝트 기간 : {project.date}
                  </p>
                  <p className={styles.projSub}>설명 : {project.subDesc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Project;

function AddModal({ onClose, setProjects }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectMainDesc, setProjectMainDesc] = useState("");
  const [projectSubDesc, setProjectSubDesc] = useState("");
  const [projectSkill, setProjectSkill] = useState("");
  const [projectPeople, setProjectPeople] = useState("");
  const [projectDate, setProjectDate] = useState("");

  const addHandler = () => {
    axios
      .post("/addProject", {
        title: projectTitle,
        mainDesc: projectMainDesc,
        subDesc: projectSubDesc,
        skill: projectSkill,
        people: projectPeople,
        date: projectDate,
      })
      .then(() => {
        alert("등록 성공!");
        setProjectMainDesc("");
        setProjectTitle("");
        setProjectSubDesc("");
        setProjectSkill("");
        setProjectPeople("");
        setProjectDate("");

        axios.get("/projectList").then((res) => {
          setProjects(res.data);
        });

        onClose();
      })
      .catch((err) => {
        console.log(err);
        alert("등록 실패");
      });
  };

  return (
    <div className={styles.addContainer}>
      <p className={styles.addName}>프로젝트 입력</p>
      <input
        placeholder="제목 입력"
        value={projectTitle}
        onChange={(e) => {
          setProjectTitle(e.target.value);
        }}
        className={styles.addTitle}
      />
      <input
        placeholder="스킬 입력"
        value={projectSkill}
        onChange={(e) => {
          setProjectSkill(e.target.value);
        }}
        className={styles.addSkill}
      />
      <input
        placeholder="인원 입력"
        value={projectPeople}
        onChange={(e) => {
          setProjectPeople(e.target.value);
        }}
        className={styles.addPeople}
      />
      <input
        placeholder="프로젝트 기간 입력"
        value={projectDate}
        onChange={(e) => {
          setProjectDate(e.target.value);
        }}
        className={styles.addDate}
      />
      <textarea
        rows={5}
        placeholder="간단한 프로젝트내용 입력"
        value={projectSubDesc}
        onChange={(e) => {
          setProjectSubDesc(e.target.value);
        }}
        className={styles.addSub}
      />
      <textarea
        rows={10}
        placeholder="세부 프로젝트내용 입력"
        value={projectMainDesc}
        onChange={(e) => {
          setProjectMainDesc(e.target.value);
        }}
        className={styles.addMain}
      />
      <button onClick={addHandler} className={styles.addBtn}>
        등록
      </button>
      <button onClick={onClose} className={styles.closeBtn}>
        닫기
      </button>
    </div>
  );
}

function EditModal({ project, onClose, setProjects }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectMainDesc, setProjectMainDesc] = useState("");
  const [projectSubDesc, setProjectSubDesc] = useState("");
  const [projectSkill, setProjectSkill] = useState("");
  const [projectPeople, setProjectPeople] = useState("");
  const [projectDate, setProjectDate] = useState("");

  useEffect(() => {
    if (project) {
      setProjectTitle(project.title);
      setProjectMainDesc(project.mainDesc);
      setProjectSubDesc(project.subDesc);
      setProjectSkill(project.skill);
      setProjectPeople(project.people);
      setProjectDate(project.date);
    }
  }, [project]);

  const editHandler = () => {
    axios
      .put("/editProject", {
        id: project.id,
        title: projectTitle,
        mainDesc: projectMainDesc,
        subDesc: projectSubDesc,
        skill: projectSkill,
        people: projectPeople,
        date: projectDate,
      })
      .then(() => {
        alert("수정 성공!");

        axios.get("/projectList").then((res) => {
          setProjects(res.data);
        });

        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.addContainer}>
      <p className={styles.addName}>프로젝트 수정</p>
      <input
        placeholder="제목 입력"
        value={projectTitle}
        onChange={(e) => {
          setProjectTitle(e.target.value);
        }}
        className={styles.addTitle}
      />
      <input
        placeholder="스킬 입력"
        value={projectSkill}
        onChange={(e) => {
          setProjectSkill(e.target.value);
        }}
        className={styles.addSkill}
      />
      <input
        placeholder="인원 입력"
        value={projectPeople}
        onChange={(e) => {
          setProjectPeople(e.target.value);
        }}
        className={styles.addPeople}
      />
      <input
        placeholder="프로젝트 기간 입력"
        value={projectDate}
        onChange={(e) => {
          setProjectDate(e.target.value);
        }}
        className={styles.addDate}
      />
      <textarea
        rows={5}
        placeholder="간단한 프로젝트내용 입력"
        value={projectSubDesc}
        onChange={(e) => {
          setProjectSubDesc(e.target.value);
        }}
        className={styles.addSub}
      />
      <textarea
        rows={10}
        placeholder="세부 프로젝트내용 입력"
        value={projectMainDesc}
        onChange={(e) => {
          setProjectMainDesc(e.target.value);
        }}
        className={styles.addMain}
      />
      <button onClick={editHandler} className={styles.addBtn}>
        등록
      </button>
      <button onClick={onClose} className={styles.closeBtn}>
        닫기
      </button>
    </div>
  );
}

function DetailModal({ onClose, project }) {
  return (
    <>
      <div className={styles.modalOverlay}></div>
      <div className={styles.detailContainer}>
        <h2 className={styles.detailTitle}>📌 {project.title}</h2>
        <p className={styles.detailSkill}>🧪 기술: {project.skill}</p>
        <p className={styles.detailPeople}>👥 인원: {project.people}</p>
        <p className={styles.detailDate}>📅 기간: {project.date}</p>
        <p className={styles.detailMainDesc}>📝 {project.mainDesc}</p>
        <button onClick={onClose} className={styles.closeBtn}>
          닫기
        </button>
      </div>
    </>
  );
}
