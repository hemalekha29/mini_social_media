import React, { useState, useEffect } from "react"; // <-- added useEffect
import { Form, Button, Card, Container } from "react-bootstrap";
import { saveToLocalStorage } from "../utils/Storage";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Please enter a valid username.");
      return;
    }
    saveToLocalStorage("user", { username });
    setUser({ username });
  };

  // Reset input
  const handleReset = () => {
    setUsername("");
  };

  // Clear input on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setUsername("");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "22rem" }} className="p-4 shadow-lg rounded-4 border-0">
        <h2 className="text-center mb-3 fw-bold">Welcome Back 👋</h2>
        <p className="text-center text-muted mb-4">
          Please enter your username to continue
        </p>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold shadow-sm"
            >
              Login 🚀
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleReset}
              className="fw-bold shadow-sm"
            >
              Reset
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
