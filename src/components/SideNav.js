import React, { useState, useContext } from "react";
import { Navbar, Nav, Button, Collapse, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import { CurrentUserContext } from "../App";
import logo from "../assets/logo.png";
import styles from "../styles/SideNav.module.css";
import Avatar from "./Avatar";

/**
 * SideNav renders the application's main navigation.
 * It supports both a responsive mobile navbar and a static desktop sidebar.
 * Navigation links adapt based on user authentication status.
 */
const SideNav = () => {
  const [open, setOpen] = useState(false); // Controls mobile menu collapse state
  const currentUser = useContext(CurrentUserContext);

  return (
    <>
      {/* Mobile Navbar Header (visible on small screens) */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className="d-lg-none px-3 py-2"
      >
        <Navbar.Brand className="d-flex align-items-center">
          <Image
            src={logo}
            alt="Dually Noted Logo"
            className={styles.Logo}
          />
        </Navbar.Brand>
        <Button variant="outline-light" onClick={() => setOpen(!open)}>
          ☰
        </Button>
      </Navbar>

      {/* Mobile Collapse Menu */}
      <Collapse in={open} className="d-lg-none">
        <div className={styles.MobileNav}>
          <Nav className="flex-column mt-3">
            {/* Always-visible navigation links */}
            <Nav.Link
              as={NavLink}
              to="/"
              exact
              onClick={() => setOpen(false)}
              className={styles.NavLink}
              activeClassName={styles.ActiveLink}
            >
              <i className="fas fa-home me-2"></i>Home
            </Nav.Link>

            {/* Links visible only when user is authenticated */}
            {currentUser && (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/notes"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                  activeClassName={styles.ActiveLink}
                >
                  <i className="fas fa-sticky-note me-2"></i>My Notes
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/tags"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                  activeClassName={styles.ActiveLink}
                >
                  <i className="fas fa-tags me-2"></i>Tags
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/shared"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                  activeClassName={styles.ActiveLink}
                >
                  <i className="fas fa-users me-2"></i>Shared
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/logout"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>Log Out
                </Nav.Link>
              </>
            )}

            {/* Links for unauthenticated users */}
            {!currentUser && (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                  activeClassName={styles.ActiveLink}
                >
                  <i className="fas fa-user-plus me-2"></i>Sign Up
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={styles.NavLink}
                  activeClassName={styles.ActiveLink}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>Log In
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* User avatar and profile link for mobile */}
          {currentUser && (
            <div
              className={`d-flex align-items-center mt-3 px-3 pt-3 border-top ${styles.ProfileSection}`}
            >
              <Avatar
                src={currentUser.profile_picture}
                height={32}
                text={currentUser.username}
              />
              <Nav.Link
                as={NavLink}
                to="/profile"
                className={`${styles.NavLink} ms-2 mb-0`}
                onClick={() => setOpen(false)}
                activeClassName={styles.ActiveLink}
              >
                {currentUser.username}
              </Nav.Link>
            </div>
          )}
        </div>
      </Collapse>

      {/* Desktop Sidebar (visible on large screens) */}
      <div className={`${styles.Sidebar} d-none d-lg-flex flex-column`}>
        <Navbar.Brand className="text-center">
          <Image src={logo} alt="Dually Noted Logo" className={styles.Logo} />
        </Navbar.Brand>

        <Nav className="flex-column flex-grow-1 px-3">
          <Nav.Link
            as={NavLink}
            to="/"
            exact
            className={styles.NavLink}
            activeClassName={styles.ActiveLink}
          >
            <i className="fas fa-home me-2"></i>Home
          </Nav.Link>

          {currentUser && (
            <>
              <Nav.Link
                as={NavLink}
                to="/notes"
                className={styles.NavLink}
                activeClassName={styles.ActiveLink}
              >
                <i className="fas fa-sticky-note me-2"></i>My Notes
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/tags"
                className={styles.NavLink}
                activeClassName={styles.ActiveLink}
              >
                <i className="fas fa-tags me-2"></i>Tags
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/shared"
                className={styles.NavLink}
                activeClassName={styles.ActiveLink}
              >
                <i className="fas fa-users me-2"></i>Shared
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/logout"
                className={styles.NavLink}
              >
                <i className="fas fa-sign-out-alt me-2"></i>Log Out
              </Nav.Link>
            </>
          )}

          {!currentUser && (
            <>
              <Nav.Link
                as={NavLink}
                to="/signup"
                className={styles.NavLink}
                activeClassName={styles.ActiveLink}
              >
                <i className="fas fa-user-plus me-2"></i>Sign Up
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/login"
                className={styles.NavLink}
                activeClassName={styles.ActiveLink}
              >
                <i className="fas fa-sign-in-alt me-2"></i>Log In
              </Nav.Link>
            </>
          )}
        </Nav>

        {/* User avatar and profile link for desktop */}
        {currentUser && (
          <div className={`pt-3 px-3 ${styles.ProfileSection}`}>
            <Avatar
              src={currentUser.profile_picture}
              height={60}
              text={currentUser.username}
            />
            <Nav.Link
              as={NavLink}
              to="/profile"
              className={styles.NavLink}
              activeClassName={styles.ActiveLink}
            >
              {currentUser.username}
            </Nav.Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideNav;
