import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database, auth } from "../firebaseConfig";
import { toast } from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";

function SignIn({ setLogedInUser, setId, logedInUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const collectionRef = collection(database, "users");

  const emailQuery = query(collectionRef, where("email", "==", user.email));

  const handleSubmit = () => {
    getDocs(emailQuery, collectionRef).then((res) => {
      if (res.docs.length < 1) {
        toast.error("user not found");
      } else {
        res.docs.map((item) => {
          if (item.data().password === user.password) {
            setLogedInUser(item.data());
            setId(item.id);
            toast.success("successfully loged in");

            navigate("/user");
          } else {
            toast.error("email or password is incorrect");
          }
        });
      }
    });

    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => console.log(error));
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
      </form>

      <button
        className="btn  m-auto py-3  text-white login__button"
        onClick={() => handleSubmit("login")}
      >
        LOG IN
      </button>

      <p className="form__footer">
        Don't you have an account?
        <Link to="/form">
          <span>Create one</span>
        </Link>
      </p>
    </section>
  );
}

export default SignIn;
