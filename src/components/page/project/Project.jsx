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
                            <p>{project.subDesc}</p>
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


    const addHandler = () => {
        axios.post("/addProject", {title: projectTitle, mainDesc: projectMainDesc, subDesc: projectSubDesc})
        .then(() => {
            alert("등록 성공!");
            setProjectMainDesc("");
            setProjectTitle("");
            setProjectSubDesc("");

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
      <textarea rows={5} placeholder="간단한 프로젝트내용 입력" value={projectSubDesc} onChange={(e)=>{setProjectSubDesc(e.target.value)}} className={styles.addSub}/>
      <textarea rows={10} placeholder="세부 프로젝트내용 입력" value={projectMainDesc} onChange={(e)=>{setProjectMainDesc(e.target.value)}} className={styles.addMain}/>
      <button onClick={addHandler} className={styles.addBtn}>등록</button>
      <button onClick={onClose} className={styles.closeBtn}>닫기</button>
    </div>
  );
}
