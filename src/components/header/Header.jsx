import { Link } from "react-router-dom";
import "./Header.css";

function Header(){
    return (
        <div className="headerContainer">
        <div className="headerTitle">
          <p>인형's 포트폴리오</p>
        </div>
        <div className="headerMenu">
          <Link to={"/"} className="link">Main</Link>
          <Link to={"/about"} className="link">About</Link>
          <Link to={"/project"} className="link">Project</Link>
          <Link to={"/board"} className="link">Board</Link>
          <Link to={"/contact"} className="link">Contact</Link>
        </div>
      </div>
    )
};


export default Header;