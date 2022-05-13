import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import uniqid from "uniqid";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const collectionRef = collection(database, "users");
  const [password, setPassword] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      email: yup.string("").email("Invalid email adress").required("required"),
      password: yup.string("").min(8, "Must be 8characters or more"),
    }),
    onSubmit: (values) => {
      handleSubmit();
    },
  });

  const handleSubmit = () => {
    const emailQuery = query(
      collectionRef,
      where("email", "==", formik.values.email)
    );

    getDocs(emailQuery, collectionRef).then((res) => {
      if (res.docs.length === 1) {
        toast.error("user already exists");
      } else if (res.docs.length === 0) {
        if (password === formik.values.password) {
          addDoc(collectionRef, {
            email: formik.values.email,
            password: formik.values.password,
            name: formik.values.name,
            image: "",
            toDos: [],
            id: uniqid(),
          }).catch((err) => alert(err.message));
        } else {
          toast.error("password do not match");
        }
      }
    });
    createUserWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    )
      .then((user) => {
        toast.success("Account added");
        navigate("/");
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
          placeholder="Enter your full name"
          className="input"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.name && formik.errors.name && (
          <p style={{ color: "red" }}>{formik.errors.name}</p>
        )}
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          placeholder="Enter your email"
          className="input"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.email && formik.errors.email && (
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
          placeholder="Enter password"
          className="input"
          required
        />
        {formik.touched.password && formik.errors.password && (
          <p style={{ color: "red" }}>{formik.errors.password}</p>
        )}
        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          name="confirm passowrd"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>

      <button
        type="submit"
        value="submit"
        className="btn  m-auto py-3  text-white login__button"
        onClick={formik.handleSubmit}
      >
        REGISTER
      </button>
      <p className="form__footer">
        Already have an account?{" "}
        <Link to="/SignIn">
          <span>Sing in</span>
        </Link>
      </p>
    </section>
  );
}

export default Login;
