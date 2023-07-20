// Home.js
import "animate.css";
import React from "react";
import { Nav, Container } from "react-bootstrap";
import Header from "../../components/Header/Header";

import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="Home">
        <div className="Home1">
          <Header />
          <Container className="main1">
            <Nav>
              <div className="Logo">
                <img
                  className="img"
                  alt="Home_Effect2"
                  src="images/Home_Effect2.png"
                ></img>
              </div>
            </Nav>
            <Nav>
              <div className="playBtn">
                <a href="/GameList">
                  <img
                    className="play"
                    alt="Home_Play"
                    src="images/Home_Play.png"
                  ></img>
                </a>
              </div>
            </Nav>
          </Container>
        </div>
      </div>
      <div className="Home">
        <div className="Home2"></div>
      </div>
      <div className="Home">
        <div className="Home3"></div>
      </div>
    </div>
  );
};

export default Home;
