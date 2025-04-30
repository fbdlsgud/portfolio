import { Link } from "react-router-dom";
import "./Main.css";

function Main() {
  return (
    <div className="mainContainer fade-in">
      <div className="mainIntroduce">
        <p className="info1">FRONT END & BACK END</p>
        <p className="info2">WEB DEVELOPER</p>
        <p className="info2">PORTFOLIO</p>
        <p className="shortBorder" />
        <p className="introduce">
          안녕하세요! 저만의 포트폴리오 사이트에 와주셔서 감사합니다!
        </p>
        <p className="introduce">
          부족하지만 항상 새로운 기술에 도전하고 싶은 류인형입니다!
        </p>
      </div>

      <div className="subMenubar">
        <Link to={"/about"} className="subMenu">
          <span className="emoji">👨🏻‍🔧</span>
          <span className="text">About me</span>
        </Link>
        <Link to={"/project"} className="subMenu">
          <span className="emoji">💻</span>
          <span className="text">Project</span>
        </Link>
        <Link to={"/board"} className="subMenu">
          <span className="emoji">👨🏻</span>
          <span className="text">Guest Board</span>
        </Link>
      </div>
    </div>
  );
}

export default Main;
