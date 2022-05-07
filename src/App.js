import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import UsersPage from "./components/UsersPage";
function App() {
  const [logedInUser, setLogedInUser] = useState();
  const [id, setId] = useState(null);
  return (
    <Router>
      <div className="App">
        <div>
          <span className="circles leftCircle"></span>
          <span className="circles rightCircle"></span>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="form" element={<Login />} />
          <Route
            path="/SignIn"
            element={
              <SignIn
                logedInUser={logedInUser}
                setLogedInUser={setLogedInUser}
                setId={setId}
              />
            }
          />
          <Route
            path="/user"
            element={<UsersPage logedInUser={logedInUser} id={id} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
