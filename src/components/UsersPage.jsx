import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import Clock from "./Clock";
function UsersPage({ logedInUser, id }) {
  const [showCard, setShowCard] = useState(false);
  const [task, setTask] = useState({ taskDes: "", title: "", done: false });
  const [line, setLine] = useState({ show: false, id: null });
  const handleAdd = () => {
    setShowCard(true);
  };
  // const [id, setid] = useState("");
  const collectionRef = collection(database, "users");

  /* adds task to storage */

  const handleToAddTask = () => {
    /* makes query to user*/
    const nameQuery = query(
      collectionRef,
      where("name", "==", logedInUser.name)
    );

    /* makes ref to user */
    const docRef = doc(database, "users", id);
    /* gets user and update toDo list */
    updateDoc(docRef, {
      toDos: [...logedInUser.toDos, task],
    });
    /* closes card wich pop's up when u are adding task */
    setShowCard(false);
  };

  const deleteItem = (index) => {
    const docRef = doc(database, "users", id);

    logedInUser.toDos.splice(index, 1);

    updateDoc(docRef, {
      toDos: [...logedInUser.toDos],
    });
  };

  if (!logedInUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <section className="userPage">
      <div className="user__header">
        <h3>Welcome, {logedInUser.name}</h3>
        <img src={logedInUser.image} alt="" className="profile__picture" />
      </div>
      {/* <Clock /> */}

      <div className="taks__container">
        <h3>Tasks List</h3>
        <div className="tasks">
          <div className="add__tastks">
            <h5>Tasks List</h5>
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="addTasks"
              onClick={() => handleAdd()}
            />
          </div>
          {logedInUser.toDos < 1 ? (
            <h4>You Don't have any, tasks let's add some</h4>
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
                        <p
                          className={
                            index === line.id && line.show
                              ? "taks__paragraph"
                              : "taks__paragraph show"
                          }
                        >
                          {task.taskDes}
                        </p>
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

          <button onClick={handleToAddTask}>Add task</button>
        </div>
      )}
    </section>
  );
}

export default UsersPage;
