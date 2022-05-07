import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../firebaseConfig";

function SignIn({ setLogedInUser, setId }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const collectionRef = collection(database, "users");

  const nameQuery = query(collectionRef, where("email", "==", user.email));

  const handleSubmit = () => {
    onSnapshot(nameQuery, (data) => {
      if (data.docs.length < 1) {
        setError("email or password is wrong");
      }
      data.docs.map((item) => {
        if (item.data().password === user.password) {
          setLogedInUser(item.data());
          setId(item.id);

          navigate("/user");
        } else {
          setError("email or password is wrong");
        }
      });
    });
  };

  return (
    <section className="login">
      <h3>Welcome Onboard!</h3>
      <p>Let's help you meet up your tasks</p>
      <form>
        <input
          type="text"
          placeholder="Enter your email"
          className="input"
          name="name"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          name="password"
          placeholder="Enter your password"
          className="input"
          required
        />
        {error && <h3 style={{ color: "red" }}>{error}</h3>}
      </form>

      <button
        className="btn  m-auto py-3  text-white login__button"
        onClick={handleSubmit}
      >
        LOG IN
      </button>

      <p className="form__footer">
        Don't you have an account?
        <Link to="/form">
          <span>Create one</span>
        </Link>
      </p>
      {/* {errorMessage && <h3>{errorMessage}</h3>} */}
    </section>
  );
}

export default SignIn;
