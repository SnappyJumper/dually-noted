import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  return (
    <div className="sidenav d-flex flex-column p-3">
        <h4 className="text-white mb-4">Dually Noted</h4>
        <Nav className="flex-column">
            <NavLink as={NavLink} to="/notes" className="text-white">My Notes</NavLink>
            <NavLink as={NavLink} to="/tags" className="text-white">Tags</NavLink>
            <NavLink as={NavLink} to="/shared" className="text-white">Shared With Me</NavLink>
            <NavLink as={NavLink} to="/profile" className="text-white">Profile</NavLink>
        </Nav>
    </div>
  );
};

export default SideNav;
