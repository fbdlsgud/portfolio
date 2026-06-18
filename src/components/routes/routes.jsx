import Main from "../page/main/Main";
import About from "../page/about/About";
import Project from "../page/project/Project";
import Board from "../page/board/Board";
import Jump from "../page/games/Jump";
import Dodge from "../page/games/Dodge";
import Games from "../page/games/Games";

const routes = [
    { path: "/" , element: <Main /> },
    { path: "/about" , element: <About /> },
    { path: "/project" , element: <Project /> },
    { path: "/board" , element: <Board /> },
    { path: "/games", element: <Games />},
    { path: "/jump", element: <Jump />},
    { path: "/dodge", element: <Dodge />}
]



export default routes;