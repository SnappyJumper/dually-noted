import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.css";
import SideNav from "./components/SideNav";
import Button from "react-bootstrap/Button";

const Home = () => (
  <div>
    <h2>Welcome to Dually Noted</h2>
    <Button variant="primary">Get Started</Button>
  </div>
);
const Notes = () => <h2>My Notes</h2>;
const Tags = () => <h2>Tags</h2>;
const Shared = () => <h2>Shared With Me</h2>;
const Profile = () => <h2>Profile</h2>;
const SignUpForm = () => <h2>Sign Up</h2>;

// App.js
function App() {
  return (
    <Router>
      <SideNav />
      <div
        className={styles.main}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/notes" component={Notes} />
          <Route path="/tags" component={Tags} />
          <Route path="/shared" component={Shared} />
          <Route path="/profile" component={Profile} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route path="*" component={() => <h2>404 Not Found</h2>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
