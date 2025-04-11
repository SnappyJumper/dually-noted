// src/pages/HomePage.js

import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import logo from "../../assets/logo.png";
import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const HomePage = () => {
  const history = useHistory();

  return (
    <div className="text-center mt-4">
      {/* Big Logo at the top */}
      <img
        src={logo}
        alt="Dually Noted Logo"
        style={{ maxHeight: "160px" }}
        className="mb-4"
      />

      {/* Centered heading */}
      <h1 className="mb-4" style={{ fontWeight: 600 }}>
        Welcome to Dually Noted
      </h1>

      {/* Note-style container for welcome message */}
      <Container className={cardStyles.StickyNoteStatic}>
        <h4 className={cardStyles.title}>Hey there!</h4>
        <p>
          Welcome to your cozy little corner of the internet for note-taking,
          organizing, and sharing thoughts without judgment! ✨
        </p>
        <p>
          Whether you're jotting down a genius idea at 2am, building a study
          library, or just need to share notes with a buddy — we've got you
          covered. Use tags to stay organized, share notes with friends, and
          edit anytime. It’s simple, snappy, and all yours.
        </p>
        <p>
          So grab a virtual sticky note and start writing — your brain will
          thank you later.
        </p>
      </Container>

      {/* CTA Button */}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-4`}
        onClick={() => history.push("/signup")}
      >
        Get Started
      </Button>
    </div>
  );
};

export default HomePage;
