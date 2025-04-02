// src/components/SideNav.jsx

import React, { useState } from 'react';
import { Navbar, Nav, Collapse, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/SideNav.css';


const SideNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Nav Toggle */}
      <Navbar bg="dark" variant="dark" expand={false} className="d-lg-none px-3">
        <Navbar.Brand>Dually Noted</Navbar.Brand>
        <Button variant="outline-light" onClick={() => setOpen(!open)}>
          ☰
        </Button>
      </Navbar>

      {/* Mobile Collapsible Menu */}
      <Collapse in={open} className="d-lg-none">
        <div className="mobile-nav bg-dark p-3">
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/notes" onClick={() => setOpen(false)} className="text-white">My Notes</Nav.Link>
            <Nav.Link as={NavLink} to="/tags" onClick={() => setOpen(false)} className="text-white">Tags</Nav.Link>
            <Nav.Link as={NavLink} to="/shared" onClick={() => setOpen(false)} className="text-white">Shared</Nav.Link>
            <Nav.Link as={NavLink} to="/profile" onClick={() => setOpen(false)} className="text-white">Profile</Nav.Link>
          </Nav>
        </div>
      </Collapse>

      {/* Fixed Sidebar for Desktop */}
      <div className="sidenav d-none d-lg-flex flex-column p-3">
        <h4 className="text-white mb-4">Dually Noted</h4>
        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/notes" className="text-white">My Notes</Nav.Link>
          <Nav.Link as={NavLink} to="/tags" className="text-white">Tags</Nav.Link>
          <Nav.Link as={NavLink} to="/shared" className="text-white">Shared</Nav.Link>
          <Nav.Link as={NavLink} to="/profile" className="text-white">Profile</Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default SideNav;
