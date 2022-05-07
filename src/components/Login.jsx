import React, { useState } from "react";
import { Link } from "react-router-dom";
import { database, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import uniqid from "uniqid";
import { toast } from "react-hot-toast";

function Login() {
  const collectionRef = collection(database, "users");
  const [img, setImg] = useState({});
  const [url, setUrl] = useState(" ");
  const [password, setPassword] = useState("");

  const [toData, setToData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const handleInput = () => {
    const toRef = ref(storage, `images/${toData.name}`);

    const uploadTask = uploadBytesResumable(toRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setUrl(downloadUrl);
        });
      }
    );
  };
  const handleSubmit = () => {
    if (url.length && password === toData.password) {
      addDoc(collectionRef, {
        email: toData.email,
        password: toData.password,
        name: toData.name,
        image: url && url,
        toDos: [],
        id: uniqid(),
      })
        .then(() => {
          toast.success("Account added");
        })
        .catch((err) => alert(err.message));
    } else {
      toast.error("password do not match");
    }

    handleInput();
  };

  return (
    <section className="login">
      <h3>Welcome Onboard!</h3>
      <p>Let's help you meet up your tasks</p>
      <form action="/">
        <input
          type="text"
          placeholder="Enter your full name"
          className="input"
          name="name"
          onChange={(e) => setToData({ ...toData, name: e.target.value })}
          required
        />
        <input
          type="email"
          name="email"
          onChange={(e) => setToData({ ...toData, email: e.target.value })}
          placeholder="Enter your email"
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          name="confirm passowrd"
          onChange={(e) => setToData({ ...toData, password: e.target.value })}
          required
        />
        <h5 style={{ alignSelf: "flex-start" }}>Choose profile picture</h5>
        <input
          type="file"
          onChange={(e) => setImg(e.target.files[0])}
          placeholder="choose profile picture"
        />
      </form>

      <button
        type="submit"
        value="submit"
        className="btn  m-auto py-3  text-white login__button"
        onClick={handleSubmit}
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
