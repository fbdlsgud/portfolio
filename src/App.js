import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import routes from "./components/routes/routes";



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {
          routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
