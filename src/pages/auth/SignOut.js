import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const SignOutPage = () => {
  const [status, setStatus] = useState("loading");
  const history = useHistory();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("/dj-rest-auth/logout/");
        localStorage.removeItem("user");
        setStatus("success");

        setTimeout(() => {
          history.push("/signin");
        }, 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    logout();
  }, [history]);

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>Logging out...</h1>

          {status === "loading" && (
            <Alert variant="info">Logging you out...</Alert>
          )}

          {status === "success" && (
            <Alert variant="success">
              You’ve been logged out. Redirecting to sign in...
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="danger">
              Something went wrong while logging out. Try again later.
            </Alert>
          )}

          <div className="mt-3">
            <Link className={btnStyles.Button} to="/signin">
              Back to Sign In
            </Link>
          </div>
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
