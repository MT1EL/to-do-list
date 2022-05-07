import React from "react";
import { Link } from "react-router-dom";
import image1 from "../images/ToDoImage1.png";
function Home() {
  return (
    <section className="Home">
      <div className="home__main">
        <img src={image1} alt="main" className="home__image" />
        <h3 className="main__header">Gets things done with TODO</h3>
        <p className="home__paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum
          dictum tempus, interdum at dignissim metus. Ultricies sed nunc.
        </p>
        <Link to="form">
          <button
            type="button"
            className="btn  m-auto py-3  text-white main__button"
          >
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
}

export default Home;
