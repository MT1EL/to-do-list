import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import UsersPage from "./components/UsersPage";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { database, auth } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function App() {
  const [logedInUser, setLogedInUser] = useState();
  const [logedinUserEmail, setLogedInUserEmail] = useState(null);
  const [id, setId] = useState(null);
  const collectionRef = collection(database, "users");

  const emailQuery = query(
    collectionRef,
    where("email", "==", logedinUserEmail)
  );

  getDocs(emailQuery, collectionRef).then((res) => {
    res.docs.map((item) => {
      setLogedInUser(item.data());
      setId(item.id);
    });
  });

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLogedInUserEmail(authUser.email);
        console.log(authUser);
      } else {
        //user has logged out
        return;
      }
    });
  }, []);

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
            element={
              <UsersPage
                setLogedInUser={setLogedInUser}
                logedInUser={logedInUser}
                id={id}
                setLogedInUserEmail={setLogedInUserEmail}
              />
            }
          />
        </Routes>

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
