import Main from "../page/main/Main";
import About from "../page/about/About";
import Project from "../page/project/Project";
import Board from "../page/board/Board";
import Contact from "../page/contact/Contact";

const routes = [
    { path: "/" , element: <Main /> },
    { path: "/about" , element: <About /> },
    { path: "/project" , element: <Project /> },
    { path: "/board" , element: <Board /> },
    { path: "/contact" , element: <Contact /> }
]



export default routes;