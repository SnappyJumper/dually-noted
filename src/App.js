import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

import "./api/axiosDefaults";
import styles from "./App.module.css";

import SideNav from "./components/SideNav";
import PrivateRoute from "./components/PrivateRoute";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import SignOutPage from "./pages/auth/SignOut";
import NotesPage from "./pages/notes/NotesPage";
import NoteCreatePage from "./pages/notes/NoteCreatePage";
import NoteEditPage from "./pages/notes/NoteEditPage";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import SharedNotesPage from "./pages/shared/SharedNotesPage";
import SharedNoteDetailPage from "./pages/shared/SharedNoteDetailPage";
import TagsPage from "./pages/tags/TagsPage";
import TagNotesPage from "./pages/tags/TagNotesPage";
import ProfilePage from "./pages/profile/ProfilePage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/not_found/NotFoundPage";

// Contexts for tracking and updating the logged-in user
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if a user is authenticated on initial load
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axios.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        // console.log("Auth check failed:", err);
        setCurrentUser(null);
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
              {/* Public routes */}
              <Route exact path="/" render={() => <HomePage />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route path="/login" render={() => <SignInForm />} />
              <Route path="/logout" render={() => <SignOutPage />} />
              <Route path="/profiles/username/:username" render={() => <UserProfilePage />} />

              {/* Protected routes */}
              <PrivateRoute path="/notes/create" render={() => <NoteCreatePage />} />
              <PrivateRoute path="/notes/:id/edit" render={() => <NoteEditPage />} />
              <PrivateRoute path="/notes/:id" exact render={() => <NoteDetailPage />} />
              <PrivateRoute path="/notes" render={() => <NotesPage />} />
              <PrivateRoute path="/tags/:id" render={() => <TagNotesPage />} />
              <PrivateRoute path="/tags" render={() => <TagsPage />} />
              <PrivateRoute path="/shared/:id" render={() => <SharedNoteDetailPage />} />
              <PrivateRoute path="/shared" render={() => <SharedNotesPage />} />
              <PrivateRoute path="/profile" render={() => <ProfilePage />} />

              {/* Catch-all route */}
              <Route path="*" render={() => <NotFoundPage />} />
            </Switch>
          </div>
        </Router>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
