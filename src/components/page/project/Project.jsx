import { useEffect, useState } from "react";
import styles from "./Project.module.css";
import axios from "../../../axios/axiosInstance";

function Project() {

  //프젝//
    const [projects, setProjects] =useState([]);
  //프젝//

  //모달
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  //모달

  const addOpen = () => {
    setAddModalVisible(true);
  };



  useEffect(()=>{
    axios.get("/projectList")
    .then((res)=>{setProjects(res.data)})
    .catch((err)=>{console.log(err)})
  },[])


  return (
    <div className={styles.projectContainer}>
      <div className={`${styles.projectLeft} fade-in`}>
        <p className={styles.title}>Project</p>
        <p className={styles.subTitle}>저의 프로젝트를 소개합니다!</p>
      </div>
      {addModalVisible && <AddModal onClose={()=>{setAddModalVisible(false)}} setProjects={setProjects}/>}
      <div className={`${styles.projectRight} fade-right`}>
        <button className={styles.addBtn} onClick={addOpen}>
          프로젝트 등록
        </button>
        <div className={styles.projectList}>
            {projects.map((project,i)=>{
                return (
                    <div className={styles.projectItem} key={i}>
                        <p>{project.title}</p>
                        <div className={styles.projectSub}>
                            <p className={styles.projSkill}>스킬  {project.skill}</p>
                            <p className={styles.projPeople}>인원  {project.people}</p>
                            <p className={styles.projDate}>프로젝트 기간  {project.date}</p>
                            <p className={styles.projSub}>간단 설명  {project.subDesc}</p>
                        </div>
                    </div>
                )
            })}
         

        </div>
      </div>
    </div>
  );
}

export default Project;

function AddModal({onClose,setProjects}) {

    const [projectTitle, setProjectTitle] = useState("");
    const [projectMainDesc, setProjectMainDesc] = useState("");
    const [projectSubDesc, setProjectSubDesc] = useState("");
    const [projectSkill, setProjectSkill] = useState("");
    const [projectPeople, setProjectPeople] = useState("");
    const [projectDate, setProjectDate] = useState("");


    const addHandler = () => {
        axios.post("/addProject", {title: projectTitle, mainDesc: projectMainDesc, subDesc: projectSubDesc, skill: projectSkill, people: projectPeople, date: projectDate})
        .then(() => {
            alert("등록 성공!");
            setProjectMainDesc("");
            setProjectTitle("");
            setProjectSubDesc("");
            setProjectSkill("");
            setProjectPeople("");
            setProjectDate("");

            axios.get("/projectList")
            .then((res)=>{setProjects(res.data)});
            

            onClose();

        })
        .catch((err)=> {console.log(err); alert("등록 실패");})
    }


  return (
    <div className={styles.addContainer}>
      <p className={styles.addName}>프로젝트 입력</p>
      <input placeholder="제목 입력" value={projectTitle} onChange={(e)=>{setProjectTitle(e.target.value)}} className={styles.addTitle}/>
      <input placeholder="스킬 입력" value={projectSkill} onChange={(e)=>{setProjectSkill(e.target.value)}} className={styles.addSkill}/>
      <input placeholder="인원 입력" value={projectPeople} onChange={(e)=>{setProjectPeople(e.target.value)}} className={styles.addPeople}/>
      <input placeholder="프로젝트 기간 입력" value={projectDate} onChange={(e)=>{setProjectDate(e.target.value)}} className={styles.addDate}/>
      <textarea rows={5} placeholder="간단한 프로젝트내용 입력" value={projectSubDesc} onChange={(e)=>{setProjectSubDesc(e.target.value)}} className={styles.addSub}/>
      <textarea rows={10} placeholder="세부 프로젝트내용 입력" value={projectMainDesc} onChange={(e)=>{setProjectMainDesc(e.target.value)}} className={styles.addMain}/>
      <button onClick={addHandler} className={styles.addBtn}>등록</button>
      <button onClick={onClose} className={styles.closeBtn}>닫기</button>
    </div>
  );
}
