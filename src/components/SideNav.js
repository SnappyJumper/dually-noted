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
      <Navbar bg="dark" variant="dark" expand={false} className="d-lg-none px-3 py-2">
        <Navbar.Brand className="me-auto">
          <Image src={logo} alt="Dually Noted Logo" height="40" className={styles.Logo} />
        </Navbar.Brand>
        <Button variant="outline-light" onClick={() => setOpen(!open)}>
          ☰
        </Button>
      </Navbar>

      {/* Mobile Collapse Menu */}
      <Collapse in={open} className="d-lg-none">
        <div className={styles.MobileNav}>
          <Image src={logo} alt="Dually Noted Logo" className={styles.Logo} />

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
              <i className="fas fa-home me-2"></i>Home
            </Nav.Link>

            {currentUser && (
              <>
                <Nav.Link as={NavLink} to="/notes" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-sticky-note me-2"></i>My Notes
                </Nav.Link>
                <Nav.Link as={NavLink} to="/tags" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-tags me-2"></i>Tags
                </Nav.Link>
                <Nav.Link as={NavLink} to="/shared" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-users me-2"></i>Shared
                </Nav.Link>
                <Nav.Link as={NavLink} to="/logout" onClick={() => setOpen(false)} className={styles.NavLink}>
                  <i className="fas fa-sign-out-alt me-2"></i>Log Out
                </Nav.Link>
              </>
            )}

            {!currentUser && (
              <>
                <Nav.Link as={NavLink} to="/signup" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-user-plus me-2"></i>Sign Up
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" onClick={() => setOpen(false)} className={styles.NavLink} activeClassName={styles.ActiveLink}>
                  <i className="fas fa-sign-in-alt me-2"></i>Log In
                </Nav.Link>
              </>
            )}
          </Nav>

          {currentUser && (
            <div className={`d-flex align-items-center mt-3 px-3 pt-3 border-top ${styles.ProfileSection}`}>
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
      <div className={`${styles.Sidebar} d-none d-lg-flex flex-column`}>
        <Navbar.Brand className="text-center">
          <Image src={logo} alt="Dually Noted Logo" className={styles.Logo} />
        </Navbar.Brand>

        <Nav className="flex-column flex-grow-1 px-3">
          <Nav.Link as={NavLink} to="/" exact className={styles.NavLink} activeClassName={styles.ActiveLink}>
            <i className="fas fa-home me-2"></i>Home
          </Nav.Link>

          {currentUser && (
            <>
              <Nav.Link as={NavLink} to="/notes" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-sticky-note me-2"></i>My Notes
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tags" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-tags me-2"></i>Tags
              </Nav.Link>
              <Nav.Link as={NavLink} to="/shared" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-users me-2"></i>Shared
              </Nav.Link>
              <Nav.Link as={NavLink} to="/logout" className={styles.NavLink}>
                <i className="fas fa-sign-out-alt me-2"></i>Log Out
              </Nav.Link>
            </>
          )}

          {!currentUser && (
            <>
              <Nav.Link as={NavLink} to="/signup" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-user-plus me-2"></i>Sign Up
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login" className={styles.NavLink} activeClassName={styles.ActiveLink}>
                <i className="fas fa-sign-in-alt me-2"></i>Log In
              </Nav.Link>
            </>
          )}
        </Nav>

        {currentUser && (
          <div className={`pt-3 px-3 ${styles.ProfileSection}`}>
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
