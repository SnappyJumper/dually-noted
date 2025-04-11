import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.css";
import SideNav from "./components/SideNav";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import SignOutPage from "./pages/auth/SignOut";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";
import NotesPage from "./pages/notes/NotesPage";
import SharedNotesPage from "./pages/shared/SharedNotesPage";
import TagsPage from "./pages/tags/TagsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import HomePage from "./pages/home/HomePage";
import TagNotesPage from "./pages/tags/TagNotesPage";
import NoteCreatePage from "./pages/notes/NoteCreatePage";
import NoteEditPage from "./pages/notes/NoteEditPage";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import SharedNoteDetailPage from "./pages/shared/SharedNoteDetailPage";
import UserProfilePage from "./pages/profile/UserProfilePage";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axios.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.log("Auth check failed:", err);
        setCurrentUser(null); // Just to be safe
      } finally {
        setCheckingAuth(false);
      }
    };

    handleMount();
  }, []);

  if (checkingAuth) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <Router>
          <SideNav />
          <div className={styles.main}>
            <Switch>
              <Route exact path="/" render={() => <HomePage />} />
              <PrivateRoute path="/notes/create" render={() => <NoteCreatePage />} />
              <PrivateRoute path="/notes/:id/edit" render={() => <NoteEditPage />} />
              <PrivateRoute path="/notes/:id" exact render={() => <NoteDetailPage />} />
              <PrivateRoute path="/notes" render={() => <NotesPage />} />
              <PrivateRoute path="/tags/:id" render={() => <TagNotesPage />} />
              <PrivateRoute path="/tags" render={() => <TagsPage />} />
              <PrivateRoute path="/shared/:id" render={() => <SharedNoteDetailPage />} />
              <PrivateRoute path="/shared" render={() => <SharedNotesPage />} />
              <Route path="/profiles/username/:username" render={() => <UserProfilePage />} />
              <PrivateRoute path="/profile" render={() => <ProfilePage />} />
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
