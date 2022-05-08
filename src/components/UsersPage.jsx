import React, { useState } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { database, storage } from "../firebaseConfig";

import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
function UsersPage({ logedInUser, setLogedInUser, id }) {
  const [showCard, setShowCard] = useState(false);
  const [task, setTask] = useState({ taskDes: "", title: "", done: false });
  const [img, setImg] = useState({});
  const [url, setUrl] = useState(logedInUser.image);
  console.log(logedInUser);
  const handleAdd = () => {
    setShowCard(true);
  };

  const handleToAddTask = () => {
    const docRef = doc(database, "users", id);
    updateDoc(docRef, {
      toDos: [...logedInUser.toDos, task],
    });
    setLogedInUser({ ...logedInUser, toDos: [...logedInUser.toDos, task] });
    setShowCard(false);
    handleSubmit();
  };

  const deleteItem = (index) => {
    const docRef = doc(database, "users", id);

    logedInUser.toDos.splice(index, 1);

    updateDoc(docRef, {
      toDos: [...logedInUser.toDos],
    });
    setLogedInUser({ ...logedInUser, toDos: [...logedInUser.toDos] });
  };

  if (!logedInUser) {
    return <h1>Loading...</h1>;
  }

  function handleSubmit() {
    const toRef = ref(storage, `images`);

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
    const docRef = doc(database, "users", id);
    setLogedInUser({ ...logedInUser, image: url });
    url &&
      updateDoc(docRef, {
        image: url,
      });
  }

  return (
    <section className="userPage">
      <div className="user__header">
        <h3>Welcome, {logedInUser.name}</h3>
        <div className={showCard ? "profile__absolute" : "userImage"}>
          <img
            src={
              url
                ? url
                : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            }
            alt=""
            className="profile__picture"
          />
        </div>
      </div>
      {/* <Clock /> */}

      <div className="taks__container">
        <h3 className="mx-1">Tasks List</h3>
        <div className="tasks">
          <div className="add__tastks">
            <h5 className="mx-2">Tasks List</h5>
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="addTasks"
              onClick={() => handleAdd()}
            />
          </div>
          {logedInUser.toDos < 1 ? (
            <h4 className="mx-2">You Don't have any, tasks let's add some</h4>
          ) : (
            logedInUser.toDos.map((task, index) => {
              return (
                <div className="taks mx-2" key={uniqid()}>
                  <h3>{task.title}</h3>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ width: "100%" }}
                  >
                    <div className="d-flex align-items-center w-50 ">
                      <input type="checkbox" />

                      <div className="p__container">
                        <p className={"taks__paragraph"}>{task.taskDes}</p>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="thrashIcon"
                      onClick={() => deleteItem(index)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {showCard && (
        <div className="addToDO">
          <div className="addProfileImage">
            <h5>Choose profile picture</h5>
            <input
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
              placeholder="choose profile picture"
            />
            <button onClick={() => handleSubmit()} className="mt-2">
              {" "}
              add
            </button>
          </div>
          <input
            type="text"
            placeholder="add Title"
            className="input"
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="add task"
            className="input"
            onChange={(e) => setTask({ ...task, taskDes: e.target.value })}
          />

          <button onClick={() => handleToAddTask("add")}>Add task</button>
        </div>
      )}
    </section>
  );
}

export default UsersPage;
