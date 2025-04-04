// src/components/SideNav.js

import React, { useState } from "react";
import { Navbar, Nav, Button, Collapse, Image } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../assets/logo.png"; // make sure this path is correct
import "../styles/SideNav.css";

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("user")); // TEMP: Replace with real auth logic

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

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
        <div className="mobile-nav bg-dark p-3">
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/notes" onClick={() => setOpen(false)} className="text-white">
              <i className="fas fa-sticky-note mr-2"></i>My Notes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tags" onClick={() => setOpen(false)} className="text-white">
              <i className="fas fa-tags mr-2"></i>Tags
            </Nav.Link>
            <Nav.Link as={NavLink} to="/shared" onClick={() => setOpen(false)} className="text-white">
              <i className="fas fa-users mr-2"></i>Shared
            </Nav.Link>
            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/signup" onClick={() => setOpen(false)} className="text-white">
                  <i className="fas fa-user-plus mr-2"></i>Sign Up
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" onClick={() => setOpen(false)} className="text-white">
                  <i className="fas fa-sign-in-alt mr-2"></i>Log In
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/profile" onClick={() => setOpen(false)} className="text-white">
                  <i className="fas fa-user-circle mr-2"></i>{user.username}
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="text-white">
                  <i className="fas fa-sign-out-alt mr-2"></i>Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>
      </Collapse>

      {/* Desktop Sidebar */}
      <div className="sidenav d-none d-lg-flex flex-column p-3 bg-dark text-white">
        <Navbar.Brand className="mb-4 text-center">
          <Image src={logo} alt="Dually Noted Logo" height="45" />
        </Navbar.Brand>
        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/notes" className="text-white">
            <i className="fas fa-sticky-note mr-2"></i>My Notes
          </Nav.Link>
          <Nav.Link as={NavLink} to="/tags" className="text-white">
            <i className="fas fa-tags mr-2"></i>Tags
          </Nav.Link>
          <Nav.Link as={NavLink} to="/shared" className="text-white">
            <i className="fas fa-users mr-2"></i>Shared
          </Nav.Link>
          {!user ? (
            <>
              <Nav.Link as={NavLink} to="/signup" className="text-white">
                <i className="fas fa-user-plus mr-2"></i>Sign Up
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login" className="text-white">
                <i className="fas fa-sign-in-alt mr-2"></i>Log In
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/profile" className="text-white">
                <i className="fas fa-user-circle mr-2"></i>{user.username}
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-white">
                <i className="fas fa-sign-out-alt mr-2"></i>Log Out
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>
    </>
  );
};

export default SideNav;
