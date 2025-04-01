import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SideNav from './components/SideNav';
import Button from 'react-bootstrap/Button';

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

function App() {
  return (
    <Router>
      <SideNav />
      <div className="main-content" style={{ marginLeft: '220px', padding: '2rem' }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/notes" component={Notes} />
          <Route path="/tags" component={Tags} />
          <Route path="/shared" component={Shared} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
