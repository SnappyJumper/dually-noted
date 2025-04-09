import React, { useState, useContext } from "react";
import { Navbar, Nav, Button, Collapse, Image } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../App";
import logo from "../assets/logo.png";
import styles from "../styles/SideNav.module.css";
import Avatar from "./Avatar";

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const currentUser = useContext(CurrentUserContext);

  return (
    <>
      {/* Mobile Navbar Header */}
      <Navbar bg="dark" variant="dark" expand={false} className="d-lg-none px-3">
        <Navbar.Brand>
          <Image src={logo} alt="Dually Noted Logo" height="40" />
        </Navbar.Brand>
        <Button variant="outline-light" onClick={() => setOpen(!open)}>
          ☰
        </Button>
      </Navbar>

      {/* Mobile Collapse Menu */}
      <Collapse in={open} className="d-lg-none">
        <div className={styles.MobileNav}>
          <Nav className="flex-column">
            {/* Always visible */}
            <Nav.Link
              as={NavLink}
              to="/"
              exact
              onClick={() => setOpen(false)}
              className={styles.NavLink}
              activeClassName={styles.ActiveLink}
            >
              <i className="fas fa-home mr-2"></i>Home
            </Nav.Link>

            {/* Private Links */}
            {currentUser && (
              <>
                <Nav.Link as={NavLink} to="/notes" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-sticky-note mr-2"></i>My Notes
                </Nav.Link>
                <Nav.Link as={NavLink} to="/tags" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-tags mr-2"></i>Tags
                </Nav.Link>
                <Nav.Link as={NavLink} to="/shared" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-users mr-2"></i>Shared
                </Nav.Link>
                <Nav.Link as={NavLink} to="/logout" onClick={() => setOpen(false)} className={styles.NavLink}>
                  <i className="fas fa-sign-out-alt mr-2"></i>Log Out
                </Nav.Link>
              </>
            )}

            {/* Public Links */}
            {!currentUser && (
              <>
                <Nav.Link as={NavLink} to="/signup" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-user-plus mr-2"></i>Sign Up
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-sign-in-alt mr-2"></i>Log In
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Mobile Profile at Bottom */}
          {currentUser && (
            <div className="d-flex align-items-center mt-3 px-3 border-top pt-3">
              <Avatar src={currentUser.profile_picture} height={32} text={currentUser.username} />
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

      {/* Desktop Sidebar */}
      <div className={`${styles.Sidebar} d-none d-lg-flex flex-column p-3`}>
        <Navbar.Brand className="mb-4 text-center">
          <Image src={logo} alt="Dually Noted Logo" height="45" />
        </Navbar.Brand>
        <Nav className="flex-column flex-grow-1">
          {/* Always visible */}
          <Nav.Link
            as={NavLink}
            to="/"
            exact
            className={styles.NavLink}
            activeClassName={styles.ActiveLink}
          >
            <i className="fas fa-home mr-2"></i>Home
          </Nav.Link>

          {/* Private Links */}
          {currentUser && (
            <>
              <Nav.Link as={NavLink} to="/notes" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-sticky-note mr-2"></i>My Notes
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tags" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-tags mr-2"></i>Tags
              </Nav.Link>
              <Nav.Link as={NavLink} to="/shared" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-users mr-2"></i>Shared
              </Nav.Link>
              <Nav.Link as={NavLink} to="/logout" className={styles.NavLink}>
                <i className="fas fa-sign-out-alt mr-2"></i>Log Out
              </Nav.Link>
            </>
          )}

          {/* Public Links */}
          {!currentUser && (
            <>
              <Nav.Link as={NavLink} to="/signup" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-user-plus mr-2"></i>Sign Up
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-sign-in-alt mr-2"></i>Log In
              </Nav.Link>
            </>
          )}
        </Nav>

        {/* Desktop Profile at Bottom */}
        {currentUser && (
          <div className="mt-auto text-center pt-3 border-top">
            <Avatar src={currentUser.profile_picture} height={60} text={currentUser.username} />
            <Nav.Link as={NavLink} to="/profile" className={styles.NavLink} activeClassName={styles.ActiveLink}>
              {currentUser.username}
            </Nav.Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideNav;
