import React, { useState, useEffect, useContext } from "react";
import { SetCurrentUserContext } from "../../App";
import { Link } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SignUpForm = () => {
  const setCurrentUser = useContext(SetCurrentUserContext);

  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (!username.trim() || !password1 || !password2) {
      setErrors({ non_field_errors: ["All fields are required."] });
      setStatus("error");
      return;
    }

    if (password1 !== password2) {
      setErrors({ password2: ["Passwords do not match."] });
      setStatus("error");
      return;
    }

    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);

      const loginResponse = await axios.post("/dj-rest-auth/login/", {
        username,
        password: password1,
      });

      localStorage.setItem("user", JSON.stringify(loginResponse.data));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Token ${loginResponse.data.key}`;

      const { data: userData } = await axios.get("/dj-rest-auth/user/");
      setCurrentUser(userData);

      setStatus("success");
      setTimeout(() => {
        history.push("/");
      }, 2000);
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ["Signup failed."] });
      setStatus("error");
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign up</h1>

          {status === "success" && (
            <Alert variant="success" className="mt-3">
              Account created successfully! Redirecting to home...
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="danger" className="mt-3">
              Signup failed. Please fix the errors below and try again.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password2">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Button
              disabled={status === "loading"}
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              {status === "loading" ? "Signing up..." : "Sign up"}
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/login">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      ></Col>
    </Row>
  );
};

export default SignUpForm;
