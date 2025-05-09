import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";

import { SetCurrentUserContext } from "../../App";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

/**
 * SignInForm allows users to log into their accounts.
 * It submits credentials to the backend, fetches the user profile if successful,
 * and redirects the user to their notes page.
 */
const SignInForm = () => {
  const setCurrentUser = useContext(SetCurrentUserContext);
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const history = useHistory();

  const handleChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (!username || !password) {
      setErrors({ non_field_errors: ["Username and password are required."] });
      setStatus("error");
      return;
    }

    try {
      await axios.post("/dj-rest-auth/login/", signInData);

      setTimeout(async () => {
        try {
          const { data: userData } = await axios.get("/dj-rest-auth/user/");
          setCurrentUser(userData);
          setStatus("success");
          history.push("/notes");
        } catch (err) {
          console.error("Error fetching user after login", err);
          setStatus("error");
        }
      }, 500);
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ["Login failed."] });
      setStatus("error");
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>Sign in</h1>

          {status === "success" && (
            <Alert variant="success" className="mt-3">
              Welcome back! Redirecting to your notes...
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="danger" className="mt-3">
              There was a problem logging you in. Please check your credentials.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                autoComplete="off"
              />
            </Form.Group>
            {errors.username?.map((msg, idx) => (
              <Alert key={idx} variant="warning">{msg}</Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                autoComplete="off"
              />
            </Form.Group>
            {errors.password?.map((msg, idx) => (
              <Alert key={idx} variant="warning">{msg}</Alert>
            ))}

            <div className="d-flex mt-3">
              <Button
                disabled={status === "loading"}
                className={`${btnStyles.Button} ${btnStyles.Bright} ${btnStyles.Wide}`}
                type="submit"
                aria-label="Submit login form"
              >
                {status === "loading" ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            {errors.non_field_errors?.map((msg, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {msg}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don’t have an account? <span>Sign up</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}></Col>
    </Row>
  );
};

export default SignInForm;
