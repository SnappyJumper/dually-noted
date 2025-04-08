import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.css";
import SideNav from "./components/SideNav";
import Button from "react-bootstrap/Button";
import './api/axiosDefaults'
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import SignOutPage from "./pages/auth/SignOut";
import axios from "axios";

export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

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

// App.js
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    try {
      const {data} = await axios.get('/dj-rest-auth/user/');
      setCurrentUser(data);
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleMount()
  }, [])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
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
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route path="/login" render={() => <SignInForm />} />
              <Route path="/logout" render={() => <SignOutPage />} />
              <Route path="*" component={() => <h2>404 Not Found</h2>} />
            </Switch>
          </div>
        </Router>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
