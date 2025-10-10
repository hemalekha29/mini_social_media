import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/Storage";
import { useNavigate } from "react-router-dom";

export default function Profile({ user }) {
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = getFromLocalStorage("posts") || [];
    setMyPosts(savedPosts.filter(p => p.username === user.username));
  }, [user.username]);

  const handleDelete = postId => {
    const savedPosts = getFromLocalStorage("posts") || [];
    const updatedPosts = savedPosts.filter(p => p.id !== postId);
    saveToLocalStorage("posts", updatedPosts);
    setMyPosts(updatedPosts.filter(p => p.username === user.username));
  };

  return (
    <Container className="py-4">
      <Button variant="secondary" onClick={() => navigate("/home")}>
        ← Back to Home
      </Button>

      <Card className="p-3 mb-4 shadow-sm mt-3">
        <h5>About @{user.username}</h5>
        <p className="text-muted mb-0">Just vibing and posting thoughts 💭</p>
      </Card>

      <h4>📝 Your Posts</h4>
      {myPosts.length === 0 ? (
        <p className="text-muted">You haven't posted anything yet.</p>
      ) : (
        myPosts.map(post => (
          <Card key={post.id} className="p-3 mb-3 shadow-sm">
            <p>{post.content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Posted on {new Date(post.id).toLocaleString()} | ❤️ {post.likes?.length || 0} | 💬 {post.comments?.length || 0}
              </small>
              <Button size="sm" variant="outline-danger" onClick={() => handleDelete(post.id)}>
                <FaTrash />
              </Button>
            </div>
          </Card>
        ))
      )}
    </Container>
  );
}
