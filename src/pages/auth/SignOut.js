import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { SetCurrentUserContext } from "../../App";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {
  Button,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const SignOutPage = () => {
  const [status, setStatus] = useState("confirm");
  const history = useHistory();
  const setCurrentUser = useContext(SetCurrentUserContext);

  const handleLogout = async () => {
    setStatus("loading");
    try {
      await axios.post("/dj-rest-auth/logout/");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setStatus("success");

      setTimeout(() => {
        history.push("/login");
      }, 2000);
    } catch (err) {
      setStatus("error");
    }
  };

  const handleCancel = () => {
    history.push("/notes");
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>Log Out</h1>

          {status === "confirm" && (
            <>
              <p>Are you sure you want to log out?</p>
              <div className="d-flex gap-2">
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Bright}`}
                  onClick={handleLogout}
                >
                  Yes, log me out
                </Button>
                <Button
                  className={btnStyles.Button}
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {status === "loading" && (
            <Alert variant="info">Logging you out...</Alert>
          )}

          {status === "success" && (
            <Alert variant="success">
              You’ve been logged out. Redirecting to Log in...
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="danger">
              Something went wrong while logging out. Try again later.
            </Alert>
          )}
        </Container>
      </Col>

      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      ></Col>
    </Row>
  );
};

export default SignOutPage;
