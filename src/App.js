import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import routes from "./components/routes/routes";
import { LoginProvider } from "./context/LoginContext";

function App() {
  return (
    <LoginProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App;
