import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import { getFromLocalStorage } from "./utils/Storage";
import { Navbar, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";


function App() {
  const [user, setUser] = useState(getFromLocalStorage("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <Router>
      <Navbar bg="primary" variant="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand>Mini Social Media</Navbar.Brand>
          <div>
            <span className="text-white me-3">Hi, {user.username}</span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/posts" element={<Posts user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
