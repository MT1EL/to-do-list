import React, { useState } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { database, storage } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
function UsersPage({ logedInUser, setLogedInUser, id }) {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const [task, setTask] = useState({ taskDes: "", title: "", done: false });
  const [img, setImg] = useState({});
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(null);
  const handleAdd = () => {
    setShowCard(true);
  };

  const handleToAddTask = () => {
    const docRef = doc(database, "users", id);
    updateDoc(docRef, {
      toDos: [task, ...logedInUser.toDos],
    });
    setLogedInUser({ ...logedInUser, toDos: [task, ...logedInUser.toDos] });
    setShowCard(false);
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
    const toRef = ref(storage, `images${logedInUser.name}`);

    const uploadTask = uploadBytesResumable(toRef, img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setLoader(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          const docRef = doc(database, "users", id);

          setLogedInUser({ ...logedInUser, image: url });

          updateDoc(docRef, {
            image: url,
          });
          setUrl(downloadUrl);
        });
      }
    );
  }

  const handleLogOut = () => {
    setLogedInUser({});
    navigate("/");
  };

  return (
    <section className="userPage">
      <div className="user__header">
        <div>
          <h3>Welcome, {logedInUser.name}</h3>
          <button
            type="button"
            className="button btn-primary"
            onClick={() => handleLogOut()}
          >
            Log Out
          </button>
        </div>
        <div className={showCard ? "profile__absolute" : "userImage"}>
          <img
            src={
              logedInUser.image
                ? logedInUser.image
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
                      <input type="checkbox" className="checkbox" />

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
            {loader && (
              <div>
                <div className="loaderContainer">
                  <span
                    className="loader"
                    style={{ width: `${loader}%` }}
                  ></span>
                </div>
                <p>{loader}%</p>
              </div>
            )}
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
