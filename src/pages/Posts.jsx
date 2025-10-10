import React, { useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/Storage";
import { Container, Card, Button, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Posts({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = getFromLocalStorage("posts") || [];
    setPosts(savedPosts);
  }, []);

  const handleDelete = postId => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleLike = postId => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likes?.includes(user.username);
        return {
          ...post,
          likes: alreadyLiked ? post.likes.filter(u => u !== user.username) : [...(post.likes || []), user.username],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleComment = (postId, comment) => {
    if (!comment.trim()) return;
    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, comments: [...(post.comments || []), { user: user.username, text: comment }] } : post
    );
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleDeleteComment = (postId, index) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComments = [...post.comments];
        newComments.splice(index, 1);
        return { ...post, comments: newComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  return (
    <Container className="py-4">
      <Button variant="secondary" onClick={() => navigate("/home")}>
        ← Back to Home
      </Button>

      {posts.map(post => (
        <Card key={post.id} className="p-3 mb-3 shadow-sm">
          <h5>@{post.username}</h5>
          <p>{post.content}</p>
          <div className="d-flex gap-2 mb-2">
            {post.username === user.username && (
              <Button size="sm" variant="outline-danger" onClick={() => handleDelete(post.id)}>
                <FaTrash /> Delete
              </Button>
            )}
            <Button size="sm" variant={post.likes?.includes(user.username) ? "danger" : "outline-danger"} onClick={() => handleLike(post.id)}>
              ❤️ {post.likes?.length || 0}
            </Button>
          </div>

          {(post.comments || []).map((c, i) => (
            <div key={i} className="ms-3 mb-1 d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">
                <strong>@{c.user}:</strong> {c.text}
              </p>
              {c.user === user.username && (
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteComment(post.id, i)}>
                  <FaTrash />
                </Button>
              )}
            </div>
          ))}

          <Form
            onSubmit={e => {
              e.preventDefault();
              handleComment(post.id, commentText[post.id] || "");
              setCommentText({ ...commentText, [post.id]: "" });
            }}
            className="d-flex mt-2"
          >
            <Form.Control
              type="text"
              placeholder="Add a comment..."
              value={commentText[post.id] || ""}
              onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
            />
            <Button type="submit" size="sm" disabled={!commentText[post.id]?.trim()}>
              Add
            </Button>
          </Form>
        </Card>
      ))}
    </Container>
  );
}
