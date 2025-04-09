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
import PrivateRoute from "./components/PrivateRoute";
import NotesPage from "./pages/notes/NotesPage";
import SharedNotesPage from "./pages/shared/SharedNotesPage";
import TagsPage from "./pages/tags/TagsPage";
import ProfilePage from "./pages/profile/ProfilePage";


export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

const Home = () => (
  <div>
    <h2>Welcome to Dually Noted</h2>
    <Button variant="primary">Get Started</Button>
  </div>
);

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
              <PrivateRoute path="/notes" render={() => <NotesPage/>} />
              <PrivateRoute path="/tags" render={() => <TagsPage/>} />
              <PrivateRoute path="/shared" render={() => <SharedNotesPage/>} />
              <PrivateRoute path="/profile" render={() => <ProfilePage/>} />
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
