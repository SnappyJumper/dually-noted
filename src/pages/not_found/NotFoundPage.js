// src/pages/NotFoundPage.js

import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import sad from "../../assets/sad.png";
import cardStyles from "../../styles/StickyCard.module.css";
import btnStyles from "../../styles/Button.module.css";

const NotFoundPage = () => {
  const history = useHistory();

  return (
    <Container className="text-center mt-5">
      {/* Logo */}
      <img
        src={sad}
        alt="Dually Noted Logo"
        style={{ maxHeight: "140px" }}
        className="mb-4"
      />

      {/* Error title */}
      <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>404</h1>
      <h2 className="mb-4">Oops! That note’s gone missing.</h2>

      {/* Fun sticky note style message */}
      <div className={`${cardStyles.StickyNoteStatic} mx-auto`} style={{ maxWidth: "600px" }}>
        <p>
          You’ve wandered off the page… and this note’s been torn out, scribbled
          on, or just doesn’t exist.
        </p>
        <p>
          But hey, don’t worry — it happens to the best of us. Use the button below
          to head back where all your brilliant notes live!
        </p>
      </div>

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mt-4`}
        onClick={() => history.push("/")}
      >
        Back to Safety 🏠
      </Button>
    </Container>
  );
};

export default NotFoundPage;
